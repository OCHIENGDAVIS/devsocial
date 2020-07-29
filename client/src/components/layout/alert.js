import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};
const mapStateToprops = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToprops)(alert);
