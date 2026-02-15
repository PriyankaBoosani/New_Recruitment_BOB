import React from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("common");
  return (
    <footer className="app-footer py-2">
      <Container fluid>
        <div className="text-center">
          <p className="mb-0 fs-12"> {t("footer_text", { year: new Date().getFullYear() })}</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;