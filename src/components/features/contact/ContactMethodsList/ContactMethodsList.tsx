import { getSiteConfig } from "@/lib/content/get-site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-whatsapp-url";
import styles from "./ContactMethodsList.module.scss";

interface ContactMethodsListProps {
  heading: string;
}

export async function ContactMethodsList({ heading }: ContactMethodsListProps) {
  const config = await getSiteConfig();
  const { phone, email, address } = config.contact;
  const whatsAppUrl = buildWhatsAppUrl(
    config.whatsapp.number,
    config.whatsapp.message,
  );

  const hasAny = Boolean(phone || email || address || whatsAppUrl);

  if (!hasAny) {
    return null;
  }

  return (
    <aside className={styles.methods} aria-labelledby="contact-methods-heading">
      <h2 id="contact-methods-heading" className={styles.heading}>
        {heading}
      </h2>
      <ul className={styles.list}>
        {phone ? (
          <li>
            <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
          </li>
        ) : null}
        {email ? (
          <li>
            <a href={`mailto:${email}`}>{email}</a>
          </li>
        ) : null}
        {address ? <li>{address}</li> : null}
        {whatsAppUrl ? (
          <li>
            <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </li>
        ) : null}
      </ul>
    </aside>
  );
}
