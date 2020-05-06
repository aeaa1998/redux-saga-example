import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './styles.css';
import * as selectors from '../../reducers';
import * as actions from '../../actions/petOwners';



const SayHBButton = ({ onClick, isHidden = false, isLoading }) => (
    <Fragment>
        {
            !isHidden && (
                <button className='add-pet-owner-btn' onClick={onClick}>
                    {isLoading ? 'Cargando' : 'Pet Owner add'}
                </button>
            )
        }
    </Fragment>
);


export default connect(
    state => ({
        isLoading: selectors.isFetchingPetOwners(state),
        isHidden: !selectors.isAuthenticated(state),
    }),
    dispatch => ({
        onClick() {
            dispatch(
                actions.startFetchingPetOwners()
            );
        },
    })
)(SayHBButton);
