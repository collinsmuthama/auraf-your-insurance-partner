import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface CreateUserRequest {
  email: string;
  fullName: string;
  role: "client" | "agent" | "admin";
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
    const { email, fullName, role }: CreateUserRequest = await req.json();

    if (!email || !fullName || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, fullName, role" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!["client", "agent", "admin"].includes(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role. Must be client, agent, or admin" }),
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

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User with this email already exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

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

    // Assign role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: role });

    if (roleError) {
      console.error("Role assignment error:", roleError);
      // Continue anyway, user was created
    }

    // Create profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: userId,
        email: email,
        full_name: fullName
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Continue anyway, user was created
    }

    // Send welcome email with password
    if (resendApiKey) {
      const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
      const emailHtml = `
        <h2>Welcome to Auraf Insurance! 🎉</h2>
        <p>Hi ${fullName},</p>
        <p>Your account has been created successfully!</p>
        <p>Here are your login credentials:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> <code style="background-color: #e0e0e0; padding: 5px 10px; border-radius: 3px; font-family: monospace;">${password}</code></p>
          <p><strong>Role:</strong> ${roleLabel}</p>
        </div>
        <p><strong>Next Steps:</strong></p>
        <ol style="margin-left: 20px;">
          <li>Go to the login page</li>
          <li>Enter your email and temporary password above</li>
          <li>After logging in, you can change your password to something more secure</li>
        </ol>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          If you did not request this account or have any questions, please contact our support team.
        </p>
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
            subject: `Your Auraf Insurance Account is Ready! 🚀`,
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
        message: "User created successfully and welcome email sent"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in create-user function:", error);
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
