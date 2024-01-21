import React, { useState, useEffect } from 'react';

export { Test1 };

function Test1() {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYW5hbnJhajEiLCJpYXQiOjE3MDMxMzMwNTIsImV4cCI6MTcwMzEzNDg1Mn0.TRG7NuEkJC5Qxz-D5HIc-B2ycP4fryKpy-mPwNwOqw0' };
        fetch('http://localhost:8001/master-data/v1/caste/list?pageNumber=0&size=5', { headers })
            .then(response => response.json())
            .then(data => setProduct(data));
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h3 class="p-3 text-center">React Bearer Token with Fetch</h3>
            <div className="card text-center m-3">
                <h5 className="card-header">GET Request with Bearer Token Authorization Header</h5>
                <div className="card-body">Product name</div>
            </div>
        </div>
    );
}