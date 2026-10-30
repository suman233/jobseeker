const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables');
    process.exit(1);
}

// Create Supabase client (server-side)
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Generate 8-digit random number (00000000-99999999)
const generateRandomNumber = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString().padStart(8, '0');
};

// 2. Get current timestamp in milliseconds
const getTimestampMs = () => {
    return Date.now();
};

// 3. Generate the unique identifier
const generateUniqueId = () => {
    const randomPart = generateRandomNumber();
    const timestampPart = getTimestampMs();
    return `${randomPart}${timestampPart}`;
};

// 4. Insert data into Supabase
const insertData = async () => {
    try {
        const uniqueId = generateUniqueId();
        const payload = {
            random_number: uniqueId,
            timestamp_ms: getTimestampMs(),
            // Add any other default fields you want
            // email: 'test@example.com',
            // full_name: 'Test User',
        };

        console.log('Inserting record with payload:', payload);

        const { data, error } = await supabase
            .from('random_numbers')
            .insert([payload]);

        if (error) {
            throw error;
        }

        console.log('✓ Successfully inserted data:');
        console.log(JSON.stringify(data, null, 2));

    } catch (error: any) {
        console.error('Error inserting data:', error?.message || error);
    }
};

// 5. Run the function
insertData();
