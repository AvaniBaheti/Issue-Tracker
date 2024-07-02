import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { marked } from 'marked';

export async function POST(req: NextRequest) {
  const { email, title, description } = await req.json();

  if (!email || !title || !description) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "ca7ef1509cdff4",
        pass: "15c07202c2b5e1"
      }
    });

    const htmlDescription = marked(description);

    const mailOptions = {
      from: process.env.SMTP_FROM, 
      to: email, 
      subject: `${title}`, 
      html: `
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          h2 {
            color: #333;
          }
          p {
            line-height: 1.5;
          }
          a {
            color: #1a0dab;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          img {
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 5px;
            background: #f8f8f8;
          }
          code {
            background-color: #f8f8f8;
            border: 1px solid #e1e1e1;
            border-radius: 3px;
            padding: 0.2em 0.4em;
            font-family: 'Courier New', Courier, monospace;
          }
          pre {
            background-color: #f8f8f8;
            border: 1px solid #e1e1e1;
            border-radius: 3px;
            padding: 1em;
            overflow-x: auto;
          }
          blockquote {
            border-left: 4px solid #ddd;
            padding: 0.5em 1em;
            color: #555;
            background-color: #f9f9f9;
            border-radius: 3px;
            margin: 0;
          }
          .description {
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 4px;
            background: #f9f9f9;
          }
        </style>
        <h2>${title}</h2>
        <div class="description">${htmlDescription}</div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
  }
}
