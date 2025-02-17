export default function NotesPanel() {
    return (
        <div className="w-64 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-lg p-4 shadow-lg">
            <h2 className="text-lg font-semibold text-white">Notes</h2>
            <button className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-400 text-white px-4 py-2 rounded-lg w-full shadow transition duration-300 ease-in-out transform hover:scale-105 hover:bg-teal-500">
                Add Notes
            </button>
            <p className="text-gray-400 mt-4">No notes added</p>
        </div>
    );
}
