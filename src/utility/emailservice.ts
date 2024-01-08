import nodemailer, { SendMailOptions, TransportOptions, SentMessageInfo } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs/promises";


interface CustomTransportOptions extends TransportOptions {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587", 10),
  secure: process.env.EMAIL_SECURE === "true", // Assuming EMAIL_SECURE is a boolean in your .env
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
} as CustomTransportOptions);

 interface EmailOptions {
  to: string;
  subject: string;
  context: Record<string, any>;
  template: string; // Add this line to include the 'template' property

}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
      const templateContent = await fs.readFile(`./../email-templates/${options.template}`, "utf-8");
      const compiledTemplate = handlebars.compile(templateContent);
      const html = compiledTemplate(options.context);
  
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html,
      };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
