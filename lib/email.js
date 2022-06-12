import emailjs from 'emailjs-com';

const sendEmail = async (templateParams) => {
  emailjs
    .send(
      'service_d58pjr8',
      'template_944ppm3',
      templateParams,
      '4wZHVd3VM5CaULioQ'
    )
    .then(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
};
