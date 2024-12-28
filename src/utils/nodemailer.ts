import nodemailer, { SentMessageInfo } from "nodemailer";

interface MailOptions {
	email: string;
	title: string;
	body: string;
}

const sendMAIL = async ({
	email,
	title,
	body,
}: MailOptions): Promise<SentMessageInfo | null> => {
	try {
		let transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});

		let info = await transporter.sendMail({
			from: "Lotto G || FullToss",
			to: `${email}`,
			subject: `${title}`,
			text: `${body}`,
		});

		console.log("printing mail on console ", info);
		return info;
	} catch (error) {
		console.log("Error while sending mail ", (error as Error).message);
	}
};

export default sendMAIL;
