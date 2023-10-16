const Razorpay = require('razorpay');

apiKey = "rzp_test_vXT2OMfYKLrPxI"
apiKeySecret = "Buyun2uFwhdNlyOvjttbSutp"

const razorpay = new Razorpay({
  key_id: apiKey,
  key_secret: apiKeySecret,
});

module.exports =  razorpay;