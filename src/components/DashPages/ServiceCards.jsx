export default function ServiceCard({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow p-4 cursor-pointer hover:scale-105 transition"
    >
      <img
        src={item.image}
        className="rounded-lg h-40 w-full object-cover"
      />
      <h2 className="mt-2 font-semibold">{item.name}</h2>
      {item.price && <p>₹ {item.price}</p>}
    </div>
  );
}