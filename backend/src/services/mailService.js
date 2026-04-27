import nodemailer from "nodemailer";

console.log("Initializing Mail Service...");
console.log(`Config: User=${process.env.EMAIL_USER?.split('@')[0]}... @... , Backend URL=${process.env.FRONTEND_URL}`);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 5000, 
  greetingTimeout: 5000,   
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Mail transporter verification failed error:", error);
    console.error("Current EMAIL_USER:", process.env.EMAIL_USER ? "Defined" : "UNDEFINED");
  } else {
    console.log("Mail server is ready to take our messages");
  }
});

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export async function sendVolunteerInvite(email, token, forms) {
  console.log(`Attempting to send volunteer invite to: ${email}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Email credentials missing in environment variables!");
    throw new Error("Email service not configured - missing credentials");
  }

  const inviteLink = `${FRONTEND_URL}/signup?token=${token}`;
  const loginLink = `${FRONTEND_URL}/login?role=volunteer`;
  
  const getBadgeStyle = (form) => {
    switch (form.toLowerCase()) {
      case 'leftover':
        return 'background-color: #f0fdf4; color: #166534; border: 1px solid #bcf0da;';
      case 'attendance':
        return 'background-color: #f0f9ff; color: #075985; border: 1px solid #bae6fd;';
      case 'order':
        return 'background-color: #fef2f2; color: #991b1b; border: 1px solid #fecaca;';
      default:
        return 'background-color: #f8fafc; color: #475569; border: 1px solid #e2e8f0;';
    }
  };

  const formsSection = forms && forms.length > 0 
    ? `
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin: 32px 0; text-align: left;">
      <p style="margin: 0 0 16px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center;">
        <span style="margin-right: 8px;">📋</span> FORMS YOU'LL NEED TO FILL OUT
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${forms.map(f => {
          const label = f.charAt(0).toUpperCase() + f.slice(1).replace(/-/g, ' ');
          return `<span style="padding: 6px 16px; border-radius: 99px; font-size: 14px; font-weight: 600; margin-right: 8px; margin-bottom: 8px; display: inline-block; ${getBadgeStyle(f)}">${label}</span>`;
        }).join("")}
      </div>
    </div>`
    : "";

  const mailOptions = {
    from: `"LunchFlow Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "You're Invited! 🥳 Join LunchFlow as a Volunteer",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);">
          
          <!-- Header Banner -->
          <div style="background-color: #4f46e5; padding: 48px 40px; text-align: center;">
            <div style="margin-bottom: 16px; display: inline-block; background: rgba(255,255,255,0.2); padding: 12px; border-radius: 16px;">
               <span style="font-size: 32px;">🍱</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;">LunchFlow</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">CYF Lunch Organiser</p>
          </div>

          <!-- Content Body -->
          <div style="padding: 48px 40px; text-align: center;">
            <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">You're Invited! 🥳</h2>
            <p style="color: #64748b; margin: 0; font-size: 16px; line-height: 1.6;">
              You've been invited to join the CYF Lunch Organiser as a <strong style="color: #4f46e5;">volunteer</strong>. Click the button below to create your account and get started.
            </p>

            <!-- CTA Button -->
            <div style="margin: 40px 0;">
              <a href="${inviteLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 18px 36px; border-radius: 14px; text-decoration: none; font-size: 18px; font-weight: 700; transition: all 0.2s ease; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">
                Sign Up Now &rarr;
              </a>
            </div>

            <!-- Assigned Forms Section -->
            ${formsSection}

            <div style="border-top: 1px solid #f1f5f9; margin-top: 32px; padding-top: 32px; text-align: left;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Already have an account?</p>
              <a href="${loginLink}" style="color: #4f46e5; text-decoration: none; font-weight: 600; font-size: 15px;">Log in to your dashboard &rarr;</a>
            </div>

            <!-- Expiration Notice -->
            <div style="margin-top: 32px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 16px; text-align: left;">
              <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
                <span style="margin-right: 8px;">⏳</span> This invite link expires in <strong>7 days</strong> and can only be used once.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 40px; background-color: #f8fafc; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 13px; font-weight: 500;">Code Your Future &mdash; Lunch Organiser</p>
            <p style="color: #cbd5e1; margin: 8px 0 0 0; font-size: 12px;">If you didn't expect this email, you can safely ignore it.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}. MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    throw error;
  }
}

export async function sendVolunteerUpdateNotification(email, forms) {
  console.log(`Attempting to send volunteer update notification to: ${email}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Email credentials missing in environment variables!");
    throw new Error("Email service not configured - missing credentials");
  }

  const loginLink = `${FRONTEND_URL}/login?role=volunteer`;
  
  const getBadgeStyle = (form) => {
    switch (form.toLowerCase()) {
      case 'leftover':
        return 'background-color: #f0fdf4; color: #166534; border: 1px solid #bcf0da;';
      case 'attendance':
        return 'background-color: #f0f9ff; color: #075985; border: 1px solid #bae6fd;';
      case 'order':
        return 'background-color: #fef2f2; color: #991b1b; border: 1px solid #fecaca;';
      default:
        return 'background-color: #f8fafc; color: #475569; border: 1px solid #e2e8f0;';
    }
  };

  const formsSection = forms && forms.length > 0 
    ? `
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin: 32px 0; text-align: left;">
      <p style="margin: 0 0 16px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center;">
        <span style="margin-right: 8px;">📋</span> YOUR UPDATED FORMS
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${forms.map(f => {
          const label = f.charAt(0).toUpperCase() + f.slice(1).replace(/-/g, ' ');
          return `<span style="padding: 6px 16px; border-radius: 99px; font-size: 14px; font-weight: 600; margin-right: 8px; margin-bottom: 8px; display: inline-block; ${getBadgeStyle(f)}">${label}</span>`;
        }).join("")}
      </div>
    </div>`
    : "";

  const mailOptions = {
    from: `"LunchFlow Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Update: Your LunchFlow access has been updated! 🍱",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);">
          
          <div style="background-color: #4f46e5; padding: 48px 40px; text-align: center;">
            <div style="margin-bottom: 16px; display: inline-block; background: rgba(255,255,255,0.2); padding: 12px; border-radius: 16px;">
               <span style="font-size: 32px;">🍱</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;">LunchFlow</h1>
          </div>

          <div style="padding: 48px 40px; text-align: center;">
            <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">Access Updated!</h2>
            <p style="color: #64748b; margin: 0; font-size: 16px; line-height: 1.6;">
              An administrator has updated your assigned forms. Log in to your dashboard to see your new tasks.
            </p>

            ${formsSection}

            <div style="margin: 40px 0;">
              <a href="${loginLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 18px 36px; border-radius: 14px; text-decoration: none; font-size: 18px; font-weight: 700; transition: all 0.2s ease; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">
                Go to Dashboard &rarr;
              </a>
            </div>
          </div>

          <div style="padding: 40px; background-color: #f8fafc; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 13px; font-weight: 500;">Code Your Future &mdash; Lunch Organiser</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Update notification sent successfully to ${email}. MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending update notification to ${email}:`, error);
    throw error;
  }
}

export async function sendOrderSummary(email, orderData) {
  console.log(`Attempting to send order summary to: ${email}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Email credentials missing in environment variables!");
    throw new Error("Email service not configured - missing credentials");
  }

  const dateStr = orderData.date ? new Date(orderData.date).toLocaleDateString("en-GB") : "N/A";

  const mailOptions = {
    from: `"LunchFlow Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `LunchFlow Order Summary: ${dateStr}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Inter', -apple-system, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden;">
          
          <div style="background-color: #4f46e5; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">Order Summary</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 16px;">${dateStr}</p>
          </div>

          <div style="padding: 40px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
              <div>
                <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase;">Total Attendance</p>
                <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 24px; font-weight: 800;">${orderData.attendance}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase;">Event ID</p>
                <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 18px; font-weight: 700;">#${orderData.order_id}</p>
              </div>
            </div>

            <h3 style="color: #1e293b; font-size: 18px; font-weight: 800; margin: 0 0 16px 0;">Items Ordered</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              ${orderData.items.map(item => `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 600;">${item.name}</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #4f46e5; font-weight: 800; text-align: right;">x${item.quantity}</td>
                </tr>
              `).join("")}
            </table>
          </div>

          <div style="padding: 32px; background-color: #f8fafc; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 13px; font-weight: 500;">Code Your Future &mdash; LunchFlow Automatically Generated Order</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error(`Error sending order summary to ${email}:`, error);
    throw error;
  }
}
