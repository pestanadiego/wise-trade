import Image from 'next/image';

export default function NftCard(props) {
  const { list, cosa, listName, img } = props;
  console.log(cosa);
  return (
    <section>
      <div className="">
        <div>
          <Image src={props.img} width={120} height={120} />
        </div>
        <div>
          <div>
            <h1>{props.list}</h1>
            <h1>{props.cosa}</h1>
          </div>
          <div>
            <h1>{props.listName}</h1>
            <button>View Info</button>
          </div>
        </div>
      </div>
    </section>
  );
}
