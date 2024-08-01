import React, { Fragment, useState } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../layout/MetaData";
import { PinDrop, Home, LocationCity, Public, Phone, TransferWithinAStation } from "@mui/icons-material";
import { Typography, Button, TextField, MenuItem, Select } from "@mui/material";
import { Country, State } from "country-state-city";
import { useAlert } from "react-alert";
import CheckoutSteps from "../Cart/CheckoutSteps.jsx";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [country, setCountry] = useState(shippingInfo.country);
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length !== 10) {
      alert.error("Phone Number should be 10 digits long");
      return;
    }
    dispatch(
      saveShippingInfo({ address, city, state, country, pinCode, phoneNo })
    );
    navigate("/order/confirm");
  };

  return (
    <Fragment>
      <MetaData title="Shipping Details" />

      <CheckoutSteps activeStep={0} />

      <div className="shippingContainer">
        <div className="shippingBox">
          <Typography variant="h2" className="shippingHeading">Shipping Details</Typography>

          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >
            <div className="shippingInput">
              <Home />
              <TextField
                label="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
              />
            </div>

            <div className="shippingInput">
              <LocationCity />
              <TextField
                label="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                fullWidth
              />
            </div>

            <div className="shippingInput">
              <PinDrop />
              <TextField
                label="Pin Code"
                type="number"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                fullWidth
              />
            </div>

            <div className="shippingInput">
              <Phone />
              <TextField
                label="Phone Number"
                type="number"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                inputProps={{ maxLength: 10 }}
                fullWidth
              />
            </div>

            <div className="shippingInput">
              <Public />
              <Select
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                displayEmpty
                fullWidth
              >
                <MenuItem value=""><em>Country</em></MenuItem>
                {Country && Country.getAllCountries().map((item) => (
                  <MenuItem key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {country && (
              <div className="shippingInput">
                <TransferWithinAStation />
                <Select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value=""><em>State</em></MenuItem>
                  {State && State.getStatesOfCountry(country).map((item) => (
                    <MenuItem key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="shippingBtn"
              // disabled={!state}
              fullWidth
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
