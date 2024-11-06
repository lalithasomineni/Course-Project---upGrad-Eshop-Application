import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import classes from "../../assets/AddProducts.module.css";
import { toast } from "react-toastify";
const Step2 = (props) => {
  let options = [];
  const [name, setName] = useState("");
  const [contactNumber, setcontactNumber] = useState("");
  const [city, setcity] = useState("");
  const [landmark, setlandmark] = useState("");
  const [street, setstreet] = useState("");
  const [state, setstate] = useState("");
  const [zipcode, setzipcode] = useState("");
  const userid = window.sessionStorage.getItem("userid");
  const [address,setAddress]=useState();
  const[change,setchange]=useState(false);
  const token = window.sessionStorage.getItem("access-token");


  
  const userAddresses = props.address.filter((user) => user.user === userid);


    if(userAddresses.length<1){
      props.address.map((useradd) => {

        options.push({
          value: useradd.id,
          label:
            useradd.street +
            "->" +
            useradd.city +
            "->" +
            useradd.state +
            "->" +
            useradd.zipcode,
        });
       
      });
    }else{
    userAddresses.map((useradd) => {

      options.push({
        value: useradd.id,
        label:
          useradd.street +
          "," +
          useradd.city +
          "," +
          useradd.state +
          "," +
          useradd.zipcode,
      });
     
    });}


  const nameHandler = (e) => {
    setName(e.target.value);
    setchange(true);
  };
  const contactNumberHandler = (e) => {
    setcontactNumber(e.target.value);
    setchange(true);
  };
  const cityHandler = (e) => {
    setcity(e.target.value);
    setchange(true);
  };
  const landmarkHandler = (e) => {
    setlandmark(e.target.value);
  };
  const streetHandler = (e) => {
    setstreet(e.target.value);
    setchange(true);
  };
  const stateHandler = (e) => {
    setstate(e.target.value);
    setchange(true);
  };
  const zipcodeHandler = (e) => {
    setzipcode(e.target.value);
    setchange(true);

  };
  const addAddressRequest = async () => {
    try {
      const r = await axios.post(
        "http://localhost:8080/api/addresses",
        {
          id:  Math.random().toString(),
          name: name,
          contactNumber: contactNumber,
          city: city,
          landmark: landmark,
          street: street,
          state: state,
          zipcode: zipcode,
          user: userid,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      options.push({
        value: r.data,
        label: street + "->" + city + "->" + state + "->" + zipcode,
      });
      setAddress(options);
     toast.success("New address added select the address and proceed !")
    } catch (e) {
      toast.error("Not Authenticated enough to add new Address please select address from drop down !!")
    }
  };

  const[addressflag,setaddressflag]=useState(false);
  const getaddressHandler = (e) => {
    setaddressflag(true);
    props.getaddressID(e.value);
  };
  
  const submitHandler = (e) => {
    e.preventDefault();
    addAddressRequest();

    setName("");
    setcity("");
    setcontactNumber("");
    setlandmark("");
    setstate("");
    setstreet("");
    setzipcode("");
  };

  return (
    <>
      <div className="mx-auto w-[60%] flex flex-col items-center gap-8 my-16">
        <div className="w-full">
          <label>Select Address</label>
   
          <CreatableSelect
            styles={{ color: "black",background:"white" }}
            isClearable
            options={address!==undefined? address: options}
            className={classes.select}
            onChange={getaddressHandler}
          />
        </div>
        <div className="text-2xl ">-OR-</div>
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-2xl">Add Address</h3>
        </div>

        <form
          className="flex flex-col items-start gap-3 w-[375px] lg:w-[575px]"
          onSubmit={submitHandler}
        >
          <TextField
            id="outlined-basic"
            label="Name *"
            variant="outlined"
            fullWidth
            value={name}
            onChange={nameHandler}
          />
          <TextField
            name="contactNumber"
            required
            id="outlined-required"
            label="Contact Number"
            placeholder="Contact Number"
            fullWidth
            value={contactNumber}
            onChange={contactNumberHandler}
          />
          <TextField
            name="street"
            required
            id="outlined-required"
            placeholder="Street"
            label="Street"
            fullWidth
            value={street}
            onChange={streetHandler}
          />
          <TextField
            name="city"
            required
            id="city"
            label="City"
            placeholder="City"
            fullWidth
            value={city}
            onChange={cityHandler}
          />
          <TextField
            name="state"
            required
            id="state"
            label="State"
            placeholder="State"
            fullWidth
            value={state}
            onChange={stateHandler}
          />
          <TextField
            name="landmark"
            id="landmark"
            label="Landmark"
            placeholder="Landmark"
            fullWidth
            value={landmark}
            onChange={landmarkHandler}
          />
          <TextField
            name="zipcode"
            required
            id="zipcode"
            label="ZipCode"
            placeholder="ZipCode"
            fullWidth
            value={zipcode}
            onChange={zipcodeHandler}
          />
          <Button
            variant="contained"
            color="primary"
            //style={{backgroundColor:"#3f51b5"}}
            fullWidth
            disabled={
              !change ||
              !name ||
              !street ||
              !city ||
              !state ||
              !zipcode ||
              !contactNumber
                ? true
                : false
            }
            type="submit"
            onClick={submitHandler}
          >
            SAVE ADDRESS
          </Button>
        </form>
      </div>
    </>
  );
};

export default Step2;
