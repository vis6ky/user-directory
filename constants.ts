
export const NATIONALITIES = [
  'American', 'British', 'Canadian', 'German', 'French', 
  'Japanese', 'Australian', 'Brazilian', 'Indian', 'Italian',
  'Spanish', 'Swedish', 'Chinese', 'Mexican', 'Dutch'
];

export const HOBBIES_POOL = [
  'Photography', 'Gardening', 'Cooking', 'Hiking', 'Painting',
  'Reading', 'Swimming', 'Coding', 'Chess', 'Yoga',
  'Gaming', 'Astronomy', 'Knitting', 'Fishing', 'Singing',
  'Dancing', 'Pottery', 'Traveling', 'Biking', 'Surfing'
];

const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'
];

export const generateMockUsers = (count: number): any[] => {
  return Array.from({ length: count }, (_, i) => {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const nationality = NATIONALITIES[Math.floor(Math.random() * NATIONALITIES.length)];
    const numHobbies = Math.floor(Math.random() * 11); // 0 to 10
    const hobbies = [...HOBBIES_POOL]
      .sort(() => 0.5 - Math.random())
      .slice(0, numHobbies);

    return {
      id: `user-${i + 1}`,
      avatar: `https://picsum.photos/seed/${i + 1}/200`,
      first_name: firstName,
      last_name: lastName,
      age: Math.floor(Math.random() * 60) + 18, // 18 to 78
      nationality,
      hobbies
    };
  });
};
