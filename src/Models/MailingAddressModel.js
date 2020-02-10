class MailingAddressModel {
    constructor(country, state, streetAddress, city, pincode) {
        this.country = country;
        this.state = state;
        this.streetAddress = streetAddress;
        this.city = city;
        this.pincode = pincode;
    }
}
export default MailingAddressModel;