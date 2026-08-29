import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-whatsapp-url";
import type { FooterContent } from "@/types/navigation";
import type { SiteConfig } from "@/types/content";
import styles from "./Footer.module.scss";

interface FooterProps {
  siteConfig: SiteConfig;
  footerContent: FooterContent;
}

export function Footer({ siteConfig, footerContent }: FooterProps) {
  const { contact, socialLinks } = siteConfig;
  const hasContact =
    Boolean(contact.phone) ||
    Boolean(contact.email) ||
    Boolean(contact.address);
  const whatsAppUrl = buildWhatsAppUrl(
    siteConfig.whatsapp.number,
    siteConfig.whatsapp.message,
  );
  const hasSocial = socialLinks.length > 0;
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <section aria-label="מידע על העסק">
            <p className={styles.brandName}>{siteConfig.businessName}</p>
            <p className={styles.brandSentence}>{footerContent.brandSentence}</p>
          </section>

          <section aria-label="קישורי ניווט">
            <h2 className={styles.sectionTitle}>ניווט</h2>
            <ul className={styles.navList}>
              {footerContent.navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {hasContact || whatsAppUrl ? (
            <section aria-label="יצירת קשר">
              <h2 className={styles.sectionTitle}>יצירת קשר</h2>
              <ul className={styles.contactList}>
                {contact.phone ? (
                  <li>
                    <a href={`tel:${contact.phone}`} className={styles.footerLink}>
                      {contact.phone}
                    </a>
                  </li>
                ) : null}
                {contact.email ? (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className={styles.footerLink}
                    >
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {contact.address ? (
                  <li>
                    <span className={styles.footerLink}>{contact.address}</span>
                  </li>
                ) : null}
                {whatsAppUrl ? (
                  <li>
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.footerLink}
                    >
                      WhatsApp
                    </a>
                  </li>
                ) : null}
              </ul>
            </section>
          ) : null}

          {hasSocial ? (
            <section aria-label="רשתות חברתיות">
              <h2 className={styles.sectionTitle}>עקבו אחרינו</h2>
              <ul className={styles.socialList}>
                {socialLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.footerLink}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <p className={styles.copyright}>
          © {currentYear} {siteConfig.businessName}. כל הזכויות שמורות.
        </p>
      </Container>
    </footer>
  );
}
