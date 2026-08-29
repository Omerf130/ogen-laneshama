import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { InnerPageHero } from "@/components/features/inner-pages/InnerPageHero";
import { ContactForm } from "@/components/features/contact/ContactForm";
import { ContactMethodsList } from "@/components/features/contact/ContactMethodsList";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-whatsapp-url";
import { getSiteConfig } from "@/lib/content/get-site-config";
import type { ContactPageContent } from "@/types/content";
import styles from "@/components/features/inner-pages/inner-pages.module.scss";
import contactStyles from "./ContactPageContent.module.scss";

interface ContactPageContentProps {
  content: ContactPageContent;
}

export async function ContactPageContent({ content }: ContactPageContentProps) {
  const config = await getSiteConfig();
  const whatsAppUrl = buildWhatsAppUrl(
    config.whatsapp.number,
    config.whatsapp.message,
  );

  return (
    <PageShell>
      <Section>
        <div className={styles.page}>
          <InnerPageHero title={content.title} subtitle={content.subtitle} />
          <p className={contactStyles.intro}>{content.intro}</p>

          <div className={styles.contactLayout}>
            <div className={styles.contactMain}>
              <ContactForm form={content.form} />
            </div>
            <div className={styles.contactAside}>
              <ContactMethodsList heading={content.contactMethodsHeading} />
              {whatsAppUrl && content.ctaWhatsApp ? (
                <div className={contactStyles.whatsApp}>
                  <Button
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="ghost"
                  >
                    {content.ctaWhatsApp}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
