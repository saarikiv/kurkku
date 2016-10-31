import React from "react";

export default class ContactInfo extends React.Component {
  render() {
    return (
      <div class="container contact-container">
        <div className="content-container centered">
          <h2 class="contact-heading">Yhteystiedot</h2>
          <p class="contact-info">Kurkunleikkaajan saari 45</p>
          <p class="contact-info">56789 Madagasgar</p>
          <p class="contact-info">Puhelin: on</p>
          <p class="contact-info">Sähköposti: on</p>
        </div>
      </div>
    );
  }
}
