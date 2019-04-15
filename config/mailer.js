module.exports = {
  active: process.env.EMAIL_SEND === 'true',
  mailchimpKey: process.env.EMAIL_KEY,
  sender: {
    email: process.env.EMAIL_FROM,
    name: 'Marble seeds app'
  }
}
