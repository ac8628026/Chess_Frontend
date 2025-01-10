
const PromotionDialog = ({ isVisible, onSelectPromotion }) => {
  if (!isVisible) return null;

  return (
    <div className="promotion-dialog m-2 ">
      <button className="p-2 rounded-sm hover:bg-amber-700 border-black bg-amber-600  " onClick={() => onSelectPromotion('q')}>Queen</button>
      <button className="p-2 rounded-sm hover:bg-amber-700 border-black bg-amber-500  " onClick={() => onSelectPromotion('r')}>Rook</button>
      <button className="p-2 rounded-sm hover:bg-amber-700 border-black bg-amber-600  " onClick={() => onSelectPromotion('b')}>Bishop</button>
      <button className="p-2 rounded-sm hover:bg-amber-700 border-black bg-amber-500  " onClick={() => onSelectPromotion('n')}>Knight</button>
    </div>
  );
};

export default PromotionDialog;
