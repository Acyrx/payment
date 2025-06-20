import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default function createContact(email: string) {
    return resend.contacts.create({
        email: email,
        audienceId: "f2c3696f-e2cf-4726-a2db-e3241397dcd7",
        unsubscribed: false,
    });
}
