import faq from '../../utils/faq';
import FAQItem from './FAQItem';

export default function FAQ() {
  return (
    <section className="bg-white py-20">
      <div className="container">
        {/* HEADING */}
        <div className="sm:w-3/4 lg:w-5/12 mx-auto px-2">
          <h1 className="heading md:text-4 lg:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="text-center text-wise-grey mt-4">
            Here are some of our FAQs. Feel free to ask more!
          </p>
        </div>
        {/* FAQ Items */}
        <div className="flex flex-col sm:w-3/4 lg:w-5/12 mt-12 mx-auto px-2">
          {faq.map((question) => (
            <FAQItem
              question={question.question}
              response={question.response}
              key={question.question}
            />
          ))}
          <a
            href="https://medium.com/@wise.inc.trade/how-does-the-process-work-1c1d66cfdbed"
            type="button"
            target="_blank"
            className="flex self-center btn btn-purple hover:bg-wise-white hover:text-black mt-12"
          >
            More Info
          </a>
        </div>
      </div>
    </section>
  );
}
