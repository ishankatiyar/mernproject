class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        console.log('Keyword for Search:', this.queryStr.keyword);
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {};

        console.log('Keyword for Search:', keyword); // Debug line
        this.query = this.query.find({...keyword});
        return this;
    }


    filter() {
        // Create a copy of the query string object
        const queryCopy = { ...this.queryStr };
    
        // Removing some fields that should not be used in the query
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);


        // Filter for Price and rating
        console.log(queryCopy)
        // Convert the query string object to JSON, and replace comparison operators
        let queryStr = JSON.stringify(queryCopy);
        console.log(queryStr)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

      
        // Parse the JSON string back to an object
        const queryObject = JSON.parse(queryStr);


        console.log(queryStr)
        // Apply the filter to the query
        this.query = this.query.find(queryObject);
    
        return this;
    }


    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1 ;
        const skip = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
    
}

module.exports = ApiFeatures;
