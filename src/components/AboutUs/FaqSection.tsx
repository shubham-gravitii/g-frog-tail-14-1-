//@ts-nocheck
"use client"
import { useState } from 'react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
  
    const toggleAccordion = () => {
      setIsOpen(!isOpen);
      setIsClicked(!isClicked);
    };
  
    return (
      <div className="accordion-item m-3 fs-5" style={{borderRadius:"20px"}} >
        <div className="accordion-header mb-1" id={`faq-heading-${question}`}>
          <button
            className={`accordion-button fs-5 ${isOpen ? '' : 'collapsed'}`}
            type="button"
            onClick={toggleAccordion}
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-controls={`faq-collapse-${question}`}
            style={{
                backgroundColor:"transparent",
                boxShadow:"none",
                borderBottom: isClicked ? "1px solid #ccc" : "none"
            }}
          >
            {question}
          </button>
        </div>
        <div
          id={`faq-collapse-${question}`}
          className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
          aria-labelledby={`faq-heading-${question}`}
          data-bs-parent="#faq-accordion"
        >
          <div className="accordion-body">{answer}</div>
        </div>
      </div>
    );
};

const FAQSection = () => {
  return (
    <div className="accordion" id="faq-accordion">
      <FAQItem
        question="How do I list my warehouse?"
        answer="Listing your warehouse is easy! Simply create an account, go to the &#x27;List Warehouse&#x27; section, and fill in the details of your space."
      />
      <FAQItem
        question="Can I visit a warehouse before renting?"
        answer="Yes, you can schedule a visit to any warehouse before making a rental decision. Contact the owner to arrange a viewing."
      />
      <FAQItem
        question="What if I need a larger space?"
        answer=" If you need a larger space, simply upgrade to our Premium Plan or contact us for custom solutions tailored to your needs."
      />
      <FAQItem
        question="Is my rental transaction secure?"
        answer="Absolutely! We prioritize the security of all rental transactions on our platform. Your peace of mind is our top priority."
      />
      <FAQItem
        question="How do I contact customer support?"
        answer="You can reach our customer support team via email, phone, or by filling out the contact form on our website."
      />
    </div>
  );
};

export default FAQSection;

