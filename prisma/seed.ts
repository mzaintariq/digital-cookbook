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
        { quantity: 1, unit: 'kg', name: 'chicken, cut into pieces' },
        { quantity: 2, unit: 'pcs', name: 'large onions, sliced' },
        { quantity: 3, unit: 'pcs', name: 'tomatoes, chopped' },
        { quantity: 2, unit: 'pcs', name: 'green chilies, sliced' },
        { quantity: 1, unit: 'tbsp', name: 'ginger paste' },
        { quantity: 1, unit: 'tbsp', name: 'garlic paste' },
        { quantity: 0.5, unit: 'cup', name: 'yogurt' },
        { quantity: 0.5, unit: 'cup', name: 'oil' },
        { quantity: 1, unit: 'tsp', name: 'red chili powder' },
        { quantity: 1, unit: 'tsp', name: 'turmeric powder' },
        { quantity: 1, unit: 'tsp', name: 'garam masala' },
        { quantity: 1, unit: 'pcs', name: 'Salt to taste' },
        { quantity: 1, unit: 'pcs', name: 'Fresh coriander for garnish' },
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
      servings: 4,
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
        { quantity: 1, unit: 'cup', name: 'yellow lentils (moong daal)' },
        { quantity: 0.5, unit: 'cup', name: 'basmati rice' },
        { quantity: 1, unit: 'pcs', name: 'onion, sliced' },
        { quantity: 2, unit: 'pcs', name: 'tomatoes, chopped' },
        { quantity: 1, unit: 'tbsp', name: 'ginger paste' },
        { quantity: 1, unit: 'tbsp', name: 'garlic paste' },
        { quantity: 1, unit: 'tsp', name: 'cumin seeds' },
        { quantity: 1, unit: 'tsp', name: 'turmeric powder' },
        { quantity: 1, unit: 'tsp', name: 'red chili powder' },
        { quantity: 0.5, unit: 'tsp', name: 'garam masala' },
        { quantity: 2, unit: 'tbsp', name: 'ghee or oil' },
        { quantity: 1, unit: 'pcs', name: 'Salt to taste' },
        { quantity: 1, unit: 'pcs', name: 'Fresh coriander for garnish' },
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
      servings: 4,
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

