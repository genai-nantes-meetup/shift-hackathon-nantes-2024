


const CardHotel = ({ hotel }) => {
    return (
        <div className="card">
            <img src={hotel.photo} alt={hotel.name} />
            <h2 className="text-xl font-bold">{hotel.name}</h2>
            <p className="text-gray-500">{hotel.description}</p>
            <p className="text-gray-500">{hotel.city}</p>
            <p className="text-gray-500">{hotel.rating}</p>
        </div>
    );
};

export default CardHotel;