import sendMAIL from "../utils/nodemailer";

const contactUsController = async (req: any, res: any) => {
	try {
		const { email, name, subject, message } = req.body;

		// Send email to admin
		sendMAIL({
			email: "admin@lotto-g.com",
			title: "New contact form submission",
			body: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
		});

		res.status(200).json({
			message: "Contact form submitted successfully",
		});
	} catch (error) {
		console.log((error as Error).message);
		return res.status(500).json({
			success: false,
			message: "Error while sending contact us email",
		});
	}
};
