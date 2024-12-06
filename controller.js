import config from 'config';
import { QueryTypes, Op } from 'sequelize';
import db from './dbConnection.js';

const productDetails = async (req, res) => {
    try{
        const {currentPage = 1, pageSize = 10, orderBy = "createdAT", orderDir = "desc", searchBy = "", searchFields = []} = req.query;
        // console.log('Product details fetched')
        //pagination
        const limit = parseInt(pageSize);
        const offset = (parseInt(currentPage)-1)*limit;

        //Filter
        let whereClause = {};
        if(searchBy) {
            if(searchFields.length > 0){
                whereClause[Op.or] = searchFields.map((field) => ({[field]: {[Op.like]: `%${searchBy}`}}))
            }else{
                whereClause[Op.or] = [
                    { productName: { [Op.like] : `%${searchBy}`}},
                    {description: { [Op.like]: `%${searchBy}`}},
                ]
            }
        }
        
        const query = `SELECT p.productId, p.productName, p.productImagesName, p.productImagesUrls, p.brandName, p.description, 
        p.itemCode, p.itemType, p.currency, p.currencyCode, p.saleAmount, p.broshureFileName, p.broshureUrls, p.vendors, 
        p.status, p.createdBy, p.createdAt, p.updatedAt, p.subCategoryId, p.categoryId, p.uomId, p.shipingMethodId, p.shippingTermId, 
        p.paymentTermId, c.categoryName, sc.subCategoryName, cu.code, cu.description as uomDescription, o.organizationId, o.orgName FROM ProductV2 as p 
        LEFT JOIN CustomerUOM as cu ON p.uomId = cu.uomId
        LEFT join Organizations as o on cu.custOrgId = o.organizationId
        LEFT JOIN Categories as c on p.categoryId = c.categoryId
        LEFT JOIN SubCategories as sc ON p.subCategoryId = sc.subCategoryId order by p.${orderBy}  limit ${limit} offset ${offset}`

        const countquery = `SELECT Count(*) as totalCount from ProductV2`
        const data = await db.sequelize.query(query, {type: QueryTypes.SELECT})
        // console.log(data); return
        const [countResult] = await db.sequelize.query(countquery, {type: QueryTypes.SELECT})
        const totalCount = countResult.totalCount;

        for(let product of data){
            if(product.vendors){
                const vendorIds = product.vendors.split(",").map((id) => id.trim());
                // console.log(vendorIds)
                const vendorQuery = `Select VendorOrganizationId, CompanyName, OrganizationLogoUrl, OrganizationLogoName
                from VendorsOrganizations where VendorOrganizationId In (${vendorIds.join(",")})`;
                // console.log(vendorQuery)
                const vendorInfo = await db.sequelize.query(vendorQuery, {type: QueryTypes.SELECT})
                product.vendorInfo = vendorInfo;
            }else{
                product.vendorInfo = []
            }
        }
        // console.log(data)

        return res.status(200).json({currentPage: parseInt(currentPage), pageSize: limit, totalPages: Math.ceil(totalCount / limit), totalCount: totalCount, data: data })

    }catch(err){
       return res.status(500).json({status: false, message: 'Internal server error', data: null})

    }
}

export default {productDetails};