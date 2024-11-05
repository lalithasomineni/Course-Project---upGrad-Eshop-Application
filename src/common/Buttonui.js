import classes from "./Button.module.css";
import Button from "@mui/material/Button";

const Buttonui= (props) => {
  return (
    <Button
      variant="contained"
      size="large"
      style={{ border: "none", boxShadow: "none" , backgroundColor:props.logout==="true"?"red": "#3f51b5" }}
      className={classes.button}
      type={props.type || "button"}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export default Buttonui;
