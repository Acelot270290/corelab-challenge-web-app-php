import React, { useState, useEffect } from "react";
import { FaStar, FaPencilAlt, FaTrash, FaPaintBrush } from "react-icons/fa";
import { SketchPicker } from "react-color";
import styles from "./Card.module.scss";

interface ICard {
  id: number;
  title: string;
  description: string;
  color: string;
  isFavorite: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onChangeColor: (color: string) => void;
  onFavoriteToggle: () => void;
  isUpdating: boolean;
}

// Função para calcular o brilho da cor
const calculateBrightness = (hexColor: string): number => {
  const color = hexColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

const Card: React.FC<ICard> = ({
  title,
  description,
  color,
  isFavorite,
  onEdit,
  onDelete,
  onChangeColor,
  onFavoriteToggle,
  isUpdating,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(color);

  useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  const handleColorChange = (color: any) => {
    setSelectedColor(color.hex);
  };

  const confirmColorChange = () => {
    onChangeColor(selectedColor);
    setShowColorPicker(false);
  };

  const brightness = calculateBrightness(selectedColor);
  const isDark = brightness < 128;

  const textColor = isDark ? "#FFFFFF" : "#000000";
  const iconColor = isDark ? "#FFFFFF" : "#808080";
  const starColor = isFavorite ? "yellow" : iconColor;

  return (
    <div className={styles.Card} style={{ backgroundColor: selectedColor, color: textColor }}>
      <div className={styles.header}>
        <h2 style={{ color: textColor }}>{title}</h2>
        <div className={styles.starContainer}>
          {isUpdating ? (
            <div className={styles.spinner}>Carregando...</div>
          ) : (
            <FaStar
              className={`${styles["favorite-icon"]} ${
                isFavorite ? "active" : ""
              }`}
              onClick={onFavoriteToggle}
              style={{ color: starColor }}
            />
          )}
        </div>
      </div>
      <div className={styles.content}>
        <p style={{ color: textColor }}>{description}</p>
      </div>
      <div className={styles.footer}>
        <div className={styles.icons}>
          <FaPencilAlt onClick={onEdit} style={{ color: iconColor }} />
          <FaPaintBrush
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{ color: iconColor }}
          />
          <FaTrash onClick={onDelete} style={{ color: iconColor }} />
        </div>
        {showColorPicker && (
          <div className={styles.colorPicker}>
            <SketchPicker color={selectedColor} onChange={handleColorChange} />
            <button className={styles.saveButton} onClick={confirmColorChange}>
              Confirmar Cor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
