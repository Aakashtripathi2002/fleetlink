import SearchVehicle from "../components/SearchVehicle";

export default function UserSearchPage({ user }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Search & Book Vehicle</h3>
      <p className="text-gray-600 mb-4">
        Enter your route and time to find available vehicles.
      </p>
      <SearchVehicle user={user} />
    </div>
  );
}
