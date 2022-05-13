export default function Footer() {
  return (
    <footer className="bg-wise-blue py-8">
      <div className="container flex flex-col md:flex-row items-center">
        <div className="flex flex-1 flex-wrap items-center justify-center md:justify-start gap-12">
          <h1 className="text-white">Wise Trade</h1>
        </div>
        <div className="flex gap-10 mt-12 md:mt-0">
          <i className="text-white text-2xl fab fa-twitter" />
        </div>
      </div>
    </footer>
  );
}
