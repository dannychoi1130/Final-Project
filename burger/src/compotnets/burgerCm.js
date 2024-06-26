import classes from "./burgerCm.module.css";
import React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import { toPng } from "html-to-image";
import { useEffect } from "react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function BurgerCm() {
  const [burger, setBurger] = useState({
    product: "Custom made Burger",
    ingredients: [],
    options: [],
    qty: 1,
    unitPrice: 0,
    totalPrice: 0,
    image: "",
  });
  const { addToCart } = useContext(CartContext);
  const [image, setImage] = useState("");
  const { currency } = useContext(CartContext);
  const { currencyRate } = useContext(CartContext);

  useEffect(() => {
    htmlToImageConvert();
    AddIngredients();
  }, []);

  const htmlToImageConvert = async () => {
    try {
      const dataUrl = await toPng(elementRef.current, {
        cacheBust: false,
      });
      const link = document.createElement("a");
      link.download = "my-image-name.png";
      link.href = dataUrl;
      setImage(dataUrl);
      setBurger.image = dataUrl;
    } catch (err) {
      console.log(err);
    }
  };

  const ingredients = [
    "Cheese",
    "Shrimp-Cake",
    "Grilled-Chicken",
    "Teriyaki-chicken",
    "Filet-O-Fish",
    "Patties",
    "Mushroom",
    "Lettuce",
    "Tomato",
    "Onion",
    "Avocado",
  ];
  const elementRef = useRef(null);

  const prices = [8, 15, 15, 15, 15, 8, 8, 8, 8, 8, 8];
  const [totalCost, setTotalCost] = useState(0);
  const [index, setIndex] = useState(Array(ingredients.length).fill(0));
  const [updatedIndex, setupdatedIndex] = useState([]);
  const addedIngredients = [];
  const addedIngredientsIndex = updatedIndex.filter((value) => value !== 0);
  const [link, setlink] = useState(false);

  function AddIngredients(i) {
    setupdatedIndex(index);
    if (updatedIndex[i] < 3) {
      updatedIndex[i] += 1;
      setlink(true);
      setTotalCost((prevTotal) => prevTotal + prices[i]);
      htmlToImageConvert();
      setBurger({
        product: "Custom made Burger",
        id: uuidv4(),
        totalPrice: totalCost + prices[0],
        unitPrice: totalCost + prices[0],
        ingredients: addedIngredients,
        options: addedIngredientsIndex,
        image: image,
        qty: 1,
      });
      console.log(burger);
    }
  }

  function DelIngredients(i) {
    setupdatedIndex(index);
    if (updatedIndex[i] > 0) {
      updatedIndex[i] -= 1;
      setTotalCost((prevTotal) => prevTotal - prices[i]);
    }
    setBurger({
      product: "Custom made Burger",

      id: uuidv4(),
      totalPrice: totalCost,
      unitPrice: totalCost,
      ingredients: addedIngredients,
      options: addedIngredientsIndex,
      image: image,
      qty: 1,
    });
  }
  async function handleAddToCart(updatedOutputObject) {
    htmlToImageConvert();
    console.log(updatedOutputObject);
    addToCart(updatedOutputObject);
  }
  function handelingSummit() {
    if (addedIngredientsIndex.every((item) => item === 0)) {
      alert("Please add ingredients to your burger!");
    } else {
      handleAddToCart(burger);
      setBurger({
        totalPrice: totalCost,
        unitPrice: totalCost,
      });
      alert(`The Custom made burger has been added to your cart!`);
    }
  }

  return (
    <div className={classes.bigContainer}>
      <div className={classes.bigTitle}>Customization</div>
      <div className={classes.wrapper}>
        <div className={classes.buttonSection}>
          <div className={classes.title}>Ingredient</div>
          <ul className={classes.allIngredientsContainer}>
            {" "}
            {/*modify*/}
            {ingredients.map((ingredient, i) => (
              <li className={classes.ingredientContainer} key={i}>
                <div className={classes.ingredientName}>{ingredient} :</div>
                <div className={classes.btn}>
                  {/*modify*/}

                  <button
                    className={classes.ingredientButton}
                    onClick={() => {
                      DelIngredients(i);
                    }}
                  >
                    -
                  </button>

                  <div className={classes.index}>{index[i]}</div>

                  <button
                    className={classes.ingredientButton}
                    onClick={() => {
                      AddIngredients(i);
                    }}
                  >
                    {" "}
                    +{" "}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={classes.cmDiv}>
          <div className={classes.burger} ref={elementRef}>
            <div className={classes.burgerbottom}></div>
            {ingredients.map((ingredient, i) => {
              const count = index[i];
              const ingredientDivs = [];

              for (let j = 0; j < count; j++) {
                ingredientDivs.push(
                  <div
                    key={`${ingredient}-${j}`}
                    className={classes[`${ingredient}`]}
                    style={{
                      marginTop: `-40px`,
                      position: `relative`,
                    }}
                  ></div>
                );
              }
              return ingredientDivs;
            })}

            <div className={classes.burgertop}></div>
          </div>
          <div className={classes.totalCost}>
            Total Cost:
            <div className={classes.costNum}>
              {currency === "HK$"
                ? `${currency} ${(totalCost * currencyRate).toFixed(0)}`
                : `${currency} ${(totalCost * currencyRate).toFixed(1)}`}
            </div>
          </div>
        </div>
      </div>
      {!link ? (
        <button className={classes.summitButton} onClick={handelingSummit}>
          Add to cart
        </button>
      ) : (
        <Link className={classes.atcBtnContainer} to="/online-order">
          <button className={classes.summitButton} onClick={handelingSummit}>
            Add to cart
          </button>
        </Link>
      )}
    </div>
  );
}

export default BurgerCm;
