// Get the data - it's already a single object (the latest row)
const inputData = $input.first().json;

// Check if we have data
if (!inputData || typeof inputData !== 'object') {
    return [{
        json: {
            error: "No data available",
            status: "failed"
        }
    }];
}

// The data is already the latest row, so we can use it directly
const latestRow = inputData;

// Transformation table
const transformationTable = {
    'sex': {
        'Male': 'masculine_hard',
        'LGBQT': 'diverse',
        'Female': 'feminine_graceful_soft'
    },
    'age_group': {
        '18-25': 'gen Z aesthetic',
        '26-30': 'millenial aesthetic',
        '31-35': 'millenial aesthetic',
        '36-40': 'middle age comfy feeling',
        '41-45': 'middle age comfy feeling',
        '46-50': 'middle age comfy feeling',
        '51-55': 'comfy_retired_chill aesthetic',
        '56-60': 'comfy_retired_chill aesthetic',
        '61-65': 'comfy_retired_chill aesthetic',
        '66-69': 'comfy_retired_chill aesthetic'
    },
    'income_class': {
        'Medium Income': 'Medium Income',
        'High Income': 'High Income',
        'Low Income': 'Low Income'
    },
    'kids': {
        'Yes': 'stroller_toys_crib',
        'No': 'no'
    },
    'pets': {
        'No': 'no',
        'Cat': 'cat_tower',
        'Dog': 'dog_house'
    },
    'family_status': {
        'Single': 'single_bed_minimal_furniture',
        'Couple': 'love_queen_bed',
        'Family': 'kid_friendly'
    },
    'occupation': {
        'Artist': 'Music_paint_artsy',
        'Retired': 'big_couch',
        'Pilot': 'aeroplane_poster',
        'Engineer': 'work_chair',
        'Entreprenuer': 'vision_board'
    },
    'interest_hobby': {
        'Movie': 'movie_poster_big_tv',
        'Music': 'Musical_intrument',
        'Biking': 'bike_in_corner',
        'Snowboarding': 'snowboard_in_corner'
    },
    'color': {
        'Green': 'primary_color_Green',
        'Beige': 'primary_color_Beige',
        'Black': 'primary_color_Black',
        'Brown': 'primary_color_Brown',
        'Navy': 'primary_color_Navy'
    },
    'lifestyle': {
        'artistic': 'artistic',
        "90's": "90's",
        'woody': 'woody',
        'minimalistic': 'minimalistic',
        'city': 'city',
        'modern': 'modern'
    },
    'texture_preference': {
        'stone': 'stones_scaffolding',
        'metal': 'metallic_finish_furniture',
        'wood': 'bare_wooden_furniture_and_floor'
    },
    'furniture_style': {
        'scandanavian': 'scandanavian',
        'pottery barn': 'pottery barn',
        'modern': 'modern',
        'ikea': 'ikea',
        'vintage': 'vintage'
    }
};

// Transform the user profile
function transformUserProfile(userData) {
    const transformedData = { ...userData };
    const aestheticElements = [];
    
    // Apply transformations (convert to lowercase for matching)
    for (const [field, mapping] of Object.entries(transformationTable)) {
        const fieldKey = field.toLowerCase();
        if (fieldKey in transformedData) {
            const originalValue = String(transformedData[fieldKey]).trim();
            const transformedValue = mapping[originalValue] || originalValue;
            transformedData[fieldKey] = transformedValue;
            
            if (transformedValue !== originalValue) {
                aestheticElements.push(transformedValue);
            }
        }
    }
    
    transformedData.aesthetic_string = aestheticElements.join(' ');
    return transformedData;
}

// Transform the latest row
const transformedProfile = transformUserProfile(latestRow);

// Generate Flux prompt
const basePrompt = "A beautifully furnished and personalized room";
const aestheticString = transformedProfile.aesthetic_string;
const roomType = transformedProfile.family_status === 'Family' && transformedProfile.kids === 'Yes' ? 'family-friendly' : 
                 transformedProfile.family_status === 'Single' ? 'modern minimalist' : 
                 transformedProfile.family_status === 'Couple' ? 'romantic cozy' : 'contemporary';

const fluxPrompt = `${basePrompt} with ${aestheticString} aesthetic, ${roomType} style, ${transformedProfile.color} color scheme, ${transformedProfile.furniture_style} furniture, ${transformedProfile.texture_preference} textures, high quality, photorealistic, interior design, cozy atmosphere`;

// Return the transformed data
return [{
    json: {
        success: true,
        customer_number: parseInt(latestRow.user_id || 0),
        original_data: latestRow,
        transformed_data: transformedProfile,
        aesthetic_string: transformedProfile.aesthetic_string,
        flux_prompt: fluxPrompt,
        timestamp: new Date().toISOString(),
        processing_status: 'completed'
    }
}];