import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface CreateAgentRequest {
  email: string;
  fullName: string;
  agentApplicationId: string;
}

// Generate a secure random password
function generatePassword(length: number = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email, fullName, agentApplicationId }: CreateAgentRequest = await req.json();

    if (!email || !fullName || !agentApplicationId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, fullName, agentApplicationId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Supabase configuration missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const password = generatePassword();

    // Create user in auth
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (userError) {
      console.error("User creation error:", userError);
      return new Response(
        JSON.stringify({ error: `Failed to create user: ${userError.message}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!userData.user) {
      return new Response(
        JSON.stringify({ error: "User creation failed - no user returned" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = userData.user.id;

    // Assign agent role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "agent" });

    if (roleError) {
      console.error("Role assignment error:", roleError);
      // Continue anyway, user was created
    }

    // Send welcome email with password
    if (resendApiKey) {
      const emailHtml = `
        <h2>Welcome to Auraf Insurance Agent Platform! 🎉</h2>
        <p>Hi ${fullName},</p>
        <p>Your agent account has been approved and created successfully!</p>
        <p>Here are your login credentials:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> <code style="background-color: #e0e0e0; padding: 5px 10px; border-radius: 3px;">${password}</code></p>
        </div>
        <p>Please log in using the credentials above. We recommend changing your password immediately after your first login.</p>
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Log in to your agent dashboard</li>
          <li>Complete your profile if needed</li>
          <li>Start managing your policies and clients</li>
        </ul>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br/>Auraf Insurance Team</p>
      `;

      try {
        const fromAddress = Deno.env.get("EMAIL_FROM") || "info@aurafinsurance.com";
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: email,
            subject: "Your Auraf Agent Account is Ready! 🚀",
            html: emailHtml,
          }),
        });
      } catch (emailError) {
        console.error("Email send error:", emailError);
        // Continue even if email fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        message: "Agent account created successfully and welcome email sent"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in create-agent function:", error);
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
