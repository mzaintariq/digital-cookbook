import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Chicken Karahi
  const chickenKarahi = await prisma.recipe.upsert({
    where: { slug: 'chicken-karahi' },
    update: {},
    create: {
      title: 'Chicken Karahi',
      slug: 'chicken-karahi',
      ingredients: [
        '1 kg chicken, cut into pieces',
        '2 large onions, sliced',
        '3 tomatoes, chopped',
        '2 green chilies, sliced',
        '1 tbsp ginger paste',
        '1 tbsp garlic paste',
        '1/2 cup yogurt',
        '1/2 cup oil',
        '1 tsp red chili powder',
        '1 tsp turmeric powder',
        '1 tsp garam masala',
        'Salt to taste',
        'Fresh coriander for garnish',
      ],
      steps: [
        'Heat oil in a karahi or wok over medium heat',
        'Add sliced onions and cook until golden brown',
        'Add ginger and garlic paste, cook for 1 minute',
        'Add chicken pieces and cook until chicken changes color',
        'Add tomatoes, green chilies, and all spices',
        'Cook until tomatoes are soft and oil separates',
        'Add yogurt and mix well',
        'Cover and cook on low heat for 15-20 minutes until chicken is tender',
        'Garnish with fresh coriander and serve hot',
      ],
      cookTimeMinutes: 45,
      spiceLevel: 4,
      tags: ['pakistani', 'curry', 'spicy', 'chicken'],
      notes: 'Best served with naan or roti. Adjust spice level according to taste.',
      rating: 5,
      approvedBy: 'System',
      status: 'publish',
    },
  })

  console.log('Created Chicken Karahi:', chickenKarahi.id)

  // Daal Chawal
  const daalChawal = await prisma.recipe.upsert({
    where: { slug: 'daal-chawal' },
    update: {},
    create: {
      title: 'Daal Chawal',
      slug: 'daal-chawal',
      ingredients: [
        '1 cup yellow lentils (moong daal)',
        '1/2 cup basmati rice',
        '1 onion, sliced',
        '2 tomatoes, chopped',
        '1 tbsp ginger paste',
        '1 tbsp garlic paste',
        '1 tsp cumin seeds',
        '1 tsp turmeric powder',
        '1 tsp red chili powder',
        '1/2 tsp garam masala',
        '2 tbsp ghee or oil',
        'Salt to taste',
        'Fresh coriander for garnish',
      ],
      steps: [
        'Wash and soak lentils for 30 minutes',
        'Cook lentils in a pot with 3 cups water, turmeric, and salt until soft',
        'In a separate pan, heat ghee and add cumin seeds',
        'Add onions and cook until golden',
        'Add ginger and garlic paste, cook for 1 minute',
        'Add tomatoes and cook until soft',
        'Add red chili powder and garam masala',
        'Add cooked lentils and mix well',
        'Simmer for 10 minutes',
        'Meanwhile, cook rice separately',
        'Serve daal over rice, garnished with coriander',
      ],
      cookTimeMinutes: 60,
      spiceLevel: 2,
      tags: ['pakistani', 'vegetarian', 'comfort-food', 'lentils'],
      notes: 'A classic Pakistani comfort food. Perfect for a simple, hearty meal.',
      rating: 5,
      approvedBy: 'System',
      status: 'publish',
    },
  })

  console.log('Created Daal Chawal:', daalChawal.id)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

