import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendTest(to: string, subject: string, text: string) {
    // This is an example using nodemailer with direct transport. For real usage configure SMTP via env.
    const transport = nodemailer.createTransport({
      jsonTransport: true,
    } as any);
    const info = await transport.sendMail({ from: 'no-reply@example.com', to, subject, text });
    this.logger.debug('Email sent: ' + JSON.stringify(info));
    return info;
  }
}
