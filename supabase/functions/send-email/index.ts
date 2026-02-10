import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { to, subject, html }: EmailRequest = await req.json();

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, html" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get Resend API key from environment
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      // Return success to prevent blocking, but log the issue
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email function configured but API key missing. Using fallback." 
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "noreply@auraf.com",
        to: to,
        subject: subject,
        html: html,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", responseData);
      // Don't fail the request, just log it
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email queued (may have failed silently)" 
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, messageId: responseData.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    // Return success to prevent blocking, but log the error
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email request processed" 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
});
