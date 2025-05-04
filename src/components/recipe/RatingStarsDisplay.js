// Nuevo Componente Simple para Mostrar Estrellas (sin interacción)
function RatingStarsDisplay({ averageRating = 0, ratingCount = 0 }) {
    if (averageRating <= 0) return null; // No mostrar si no hay rating
  
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    const stars = [];
    for (let i = 0; i < fullStars; i++) stars.push(<span key={`full-${i}`} className="star-icon display filled">★</span>);
    if (halfStar) stars.push(<span key="half" className="star-icon display half">★</span>); // Necesitará CSS para media estrella
    for (let i = 0; i < emptyStars; i++) stars.push(<span key={`empty-${i}`} className="star-icon display empty">☆</span>);
  
    return (
        <div className="rating-stars-display" title={`Promedio: ${averageRating.toFixed(1)} (${ratingCount} votos)`}>
            {stars}
            <span className="rating-count-display">({ratingCount})</span>
        </div>
    );
  }

  export default RatingStarsDisplay;