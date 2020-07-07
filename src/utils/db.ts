/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort = (sort, order) => {
  const sortBy = {};
  sortBy[sort] = order;
  return sortBy;
};

/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 */
const cleanPaginationID = result => {
  result.docs.map(element => delete element.id);
  return result;
};

export const checkQueryString = async query => {
  return new Promise((resolve, reject) => {
    try {
      if (
        typeof query.filter !== 'undefined' &&
        typeof query.fields !== 'undefined'
      ) {
        const data = {
          $or: [],
        };
        const array = [];
        // Takes fields param and builds an array by splitting with ','
        const arrayFields = query.fields.split(',');
        // Adds SQL Like %word% with regex
        arrayFields.map(item => {
          array.push({
            [item]: {
              $regex: new RegExp(query.filter, 'i'),
            },
          });
        });
        // Puts array result in data
        data.$or = array;
        resolve(data);
      } else {
        resolve({});
      }
    } catch (err) {
      console.log(err.message);
      reject();
    }
  });
};

/**
 * Builds initial options for query
 * @param {Object} query - query object
 */
const listInitOptions = async query => {
  return new Promise(resolve => {
    const order = query.order || -1;
    const sort = query.sort || 'createdAt';
    const sortBy = buildSort(sort, order);
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const populate = query.populate ? query.populate : undefined;
    const options = {
      sort: sortBy,
      lean: true,
      page,
      limit,
      populate,
    };
    resolve(options);
  });
};

export const getItems = async (query, model, condition) => {
  const options = await listInitOptions(query);

  return new Promise((resolve, reject) => {
    model.paginate(condition, options, (err, items) => {
      if (err) {
        reject();
      }
      resolve(cleanPaginationID(items));
    });
  });
};
