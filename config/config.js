var config = {};

config.name = "vedant";
config.jwtTokenExpiration = 36000;

config.otpLength = 4
config.otpCharacterExcluded = 'iIlL'
config.otpCharacterIncluded = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

config.mailFrom = 'noreply@mastersofterp.co.in'
config.mailSubjectForRegisteration = 'You are successfully registered with our platform!'
config.mailSubjectForDemoToUser = 'Thank You for Scheduling a Demo'
config.mailSubjectForDemoToSalesTeam = 'Request to schedule a demo'
config.salesTeam = ["diwakarvedant07@gmail.com"] // "siddharth.chaudhary@mastersofterp.co.in"

module.exports = config;