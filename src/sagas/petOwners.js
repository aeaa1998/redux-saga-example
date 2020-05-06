import {
    call,
    takeEvery,
    put,
    delay,
    select,
} from 'redux-saga/effects';
import * as authActions from '../actions/auth'
import * as selectors from '../reducers';
import * as actions from '../actions/petOwners';
import * as types from '../types/petOwners';
import { normalize } from 'normalizr'
import { petOwners as petOwnersSchema } from '../utils/schemas'



const API_BASE_URL = 'http://localhost:8000/api/v1';


function* fetchPetOwners(action) {
    try {
        const isAuth = yield select(selectors.isAuthenticated);

        if (isAuth) {
            const token = yield select(selectors.getAuthToken);

            const response = yield call(
                fetch,
                `${API_BASE_URL}/owners/`, {
                method: 'GET',
                body: JSON.stringify(),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`,
                },
            }
            );
            if (response.status >= 200 && response.status <= 399) {
                const data = yield response.json();
                const { entities: petOwnersById, result: order } = normalize(data, petOwnersSchema)
                yield put(actions.completeFetchingPetOwners(petOwnersById, order));
            } else {
                const { errors } = yield response.json();
                // yield put(actions.failFetchingPetOwners(non_field_errors[0]));
            }
        }
    } catch (error) {

        // Should be in a middleware
        // yield put(authActions.logout());
    }
}

function* addPetOwner(action) {
    try {
        const isAuth = yield select(selectors.isAuthenticated);

        if (isAuth) {
            const token = yield select(selectors.getAuthToken);

            const response = yield call(
                fetch,
                `${API_BASE_URL}/owners/`, {
                method: 'POST',
                body: JSON.stringify(action.payload),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`,
                },
            }
            );

            if (response.status >= 200 && response.status <= 399) {
                yield put(actions.completeAddingPetOwner(action.payload.id, action.payload));

            } else {
                // const { errors } = yield response.json();

            }
        }
    } catch (error) {
        // Should be in a middleware
        // yield put(authActions.logout());
    }
}

function* removePetOwner(action) {
    try {
        const isAuth = yield select(selectors.isAuthenticated);

        if (isAuth) {
            const token = yield select(selectors.getAuthToken);
            const petOwnerId = action.payload;

            const response = yield call(
                fetch,
                `${API_BASE_URL}/owners/${petOwnerId}/`, {
                method: 'DELETE',
                body: JSON.stringify(),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`,
                },
            }
            );

            console.log(response)

            if (response.status >= 200 && response.status <= 399) {
                yield put(actions.completeRemovingPetOwner());

            } else {
                // const { non_field_errors } = yield response.json();
                // yield put(actions.failRemovingPetOwner(petOwnerId, non_field_errors[0]));
            }

        }
    } catch (error) {
        // Should be in a middleware
        // yield put(authActions.logout());
    }
}

export function* watchFetchPetOwnersStarted() {
    yield takeEvery(
        types.PET_OWNERS_FETCH_STARTED,
        fetchPetOwners,
    );
}

export function* watchAddPetOwnersStarted() {
    yield takeEvery(
        types.PET_OWNER_ADD_STARTED,
        addPetOwner,
    );
}

export function* watchRemovePetOwnersStarted() {
    yield takeEvery(
        types.PET_OWNER_REMOVE_STARTED,
        removePetOwner,
    );
}