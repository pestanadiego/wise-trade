import Image from 'next/image';

export default function AssetApproval({ tokensToTransfer }) {
  const handleApprove = () => {
    let abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"]
let provider = ethers.getDefaultProvider('ropsten')
let contract = new ethers.Contract(tokenAddress, abi, provider)
await contract.approve(accountAddress, amount)
  };
  return (
    <div>
      <div className="flex flex-row flex-wrap justify-center gap-3 mb-6">
        {tokensToTransfer.map((token) => (
          <div className="flex flex-col border-2 rounded-md items-center bg-wise-white w-[120px] max-w-[120px] inline-block">
            <Image
              src={token.image_url}
              width={120}
              height={120}
              className="object-fill"
            />
            <p className="my-3 text-center">{token.name}</p>
            <p className="my-3 text-center">{token.id}</p>
            <button
              type="button"
              className="btn bg-wise-red"
              onClick={handleApprove}
            >
              approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
