// src/builders/ContactBuilder.js
class ContactBuilder {
    constructor() {
        this.contact = {
            title: { text1: 'CONTACT', text2: 'US' },
            storeInfo: {
                address: '54709 Willms Station Suite 350, Washington, USA',
                phone: '(415) 555-0132',
                email: 'admin@forever.com',
            },
            careerInfo: {
                text: 'Learn more about our teams and job openings.',
                buttonText: 'Explore Jobs',
            },
            imageSrc: '',  // Set dynamically
        };
    }

    setTitle(text1, text2) {
        this.contact.title = { text1, text2 };
        return this;
    }

    setStoreInfo(address, phone, email) {
        this.contact.storeInfo = { address, phone, email };
        return this;
    }

    setCareerInfo(text, buttonText) {
        this.contact.careerInfo = { text, buttonText };
        return this;
    }

    setImage(imageSrc) {
        this.contact.imageSrc = imageSrc;
        return this;
    }

    build() {
        return this.contact;
    }
}

export default ContactBuilder;
