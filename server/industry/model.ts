import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
            'This f'ile defines the properties stored in Industry
 */

// Type definition for Industry on the backend
export type Industry = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: Types.ObjectId;
    industryType: String; 
}

// Mongoose schema definition
const IndustrySchema = new Schema({
    // The userId
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // the industry type selected for the user
    industryType: {
        type: String,
        enum: [
            'Unspecified',
            'Dairy',
            'Farming',
            'Fishery',
            'Ranching',
            'Arts & Crafts',
            'Fine Art',
            'Performing Arts',
            'Photography',
            'Building Materials',
            'Civil Engineering',
            'Construction',
            'Apparel & Fashion',
            'Consumer Electronics',
            'Consumer Goods',
            'Consumer Services',
            'Cosmetics',
            'Food & Beverages',
            'Furniture',
            'Luxury Goods & Jewelry',
            'Sporting Goods',
            'Tobacco',
            'Wine & Spirits',
            'Accounting',
            'Business Supplies & Equipment',
            'Environmental Services',
            'Events Services',
            'Executive Office',
            'Facilities Services',
            'Human Resources',
            'Information Services',
            'Management Consulting',
            'Outsourcing/Offshoring',
            'Professional Training & Coaching',
            'Security & Investigations',
            'Staffing & Recruiting',
            'Architecture & Planning',
            'Design',
            'Graphic Design',
            'E-learning',
            'Education Management',
            'Higher Education',
            'Primary/Secondary Education',
            'Research',
            'Mining & Metals',
            'Oil & Energy',
            'Utilities',
            'Animation',
            'Broadcast Media',
            'Computer Games',
            'Entertainment',
            'Media Production',
            'Mobile Games',
            'Motion Pictures & Film',
            'Music',      
            'Banking',
            'Capital Markets',
            'Financial Services',
            'Insurance',
            'Investment Banking',
            'Investment Management',
            'Venture Capital & Private Equity',
            'Computer Hardware',
            'Computer Networking',
            'Nanotechnology',
            'Semiconductors',
            'Telecommunications',
            'Wireless',
            'Biotechnology',
            'Hospital & Health Care',
            'Medical Device',
            'Medical Practice',
            'Mental Health Care',
            'Pharmaceuticals',
            'Veterinary',
            'Alternative Dispute Resolution',
            'Law Practice',
            'Legal Services',
            'Automotive',
            'Aviation & Aerospace',
            'Chemicals',
            'Defense & Space',
            'Electrical & Electronic Manufacturing',
            'Food Production',
            'Glass, Ceramics & Concrete',
            'Industrial Automation',
            'Machinery',
            'Mechanical Or Industrial Engineering',
            'Packaging & Containers',
            'Paper & Forest Products',
            'Plastics',
            'Railroad Manufacture',
            'Renewables & Environment',
            'Shipbuilding',
            'Textiles',
            'Market Research',
            'Marketing & Advertising',
            'Newspapers',
            'Online Media',
            'Printing',
            'Public Relations & Communications',
            'Publishing',
            'Translation & Localization',
            'Writing & Editing',
            'Civic & Social Organization',
            'Fundraising',
            'Individual & Family Services',
            'International Trade & Development',
            'Libraries',
            'Museums & Institutions',
            'Non-profit Organization Management',
            'Philanthropy',
            'Program Development',
            'Religious Institutions',
            'Think Tanks',
            'Government Administration',
            'Government Relations',
            'International Affairs',
            'Judiciary',
            'Legislative Office',
            'Political Organization',
            'Public Policy',
            'Law Enforcement',
            'Military',
            'Public Safety',
            'Commercial Real Estate',
            'Real Estate',
            'Airlines/Aviation',
            'Gambling & Casinos',
            'Hospitality',
            'Leisure, Travel & Tourism',
            'Recreational Facilities & Services',
            'Restaurants',
            'Sports',
            'Retail',
            'Supermarkets',
            'Wholesale',
            'Computer & Network Security',
            'Computer Software',
            'Information Technology & Services',
            'Internet',
            'Import & Export',
            'Logistics & Supply Chain',
            'Maritime',
            'Package/Freight Delivery',
            'Transportation/Trucking/Railroad',
            'Warehousing',
            'Alternative Medicine',
            'Health, Wellness & Fitness'
        ],
        default: 'Unspecified',
        required: true
    }
});

const IndustryModel = model<Industry>('Industry', IndustrySchema);
export default IndustryModel;