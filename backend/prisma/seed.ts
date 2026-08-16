import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const options = [
  { title: 'Small', additionalPrice: 0 },
  { title: 'Medium', additionalPrice: 4 },
  { title: 'Large', additionalPrice: 6 },
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const pizzas = await prisma.category.create({
    data: {
      slug: 'pizzas',
      title: 'Cheesy Pizzas',
      desc: 'Pizza Paradise: Irresistible slices, mouthwatering toppings, and cheesy perfection.',
      img: '/temporary/m3.png',
      color: 'white',
    },
  });

  const burgers = await prisma.category.create({
    data: {
      slug: 'burgers',
      title: 'Juicy Burgers',
      desc: 'Burger Bliss: Juicy patties, bold flavors, and gourmet toppings galore.',
      img: '/temporary/m2.png',
      color: 'black',
    },
  });

  const pastas = await prisma.category.create({
    data: {
      slug: 'pastas',
      title: 'Italian Pastas',
      desc: 'Savor the taste of perfection with our exquisite Italian handmade pasta menu.',
      img: '/temporary/m1.png',
      color: 'white',
    },
  });

  const products = [
    // FEATURED
    {
      title: 'Sicilian',
      desc: 'Ignite your taste buds with a fiery combination of spicy pepperoni, jalapeños, crushed red pepper flakes, and melted mozzarella cheese, delivering a kick with every bite.',
      img: '/temporary/p1.png',
      price: 24.9,
      categoryId: pizzas.id,
      isFeatured: true,
    },
    {
      title: 'Bacon Deluxe',
      desc: 'Indulge in smoky goodness with a flame-grilled beef patty, topped with crispy bacon, melted cheddar cheese, caramelized onions, and a smattering of tangy BBQ sauce.',
      img: '/temporary/p2.png',
      price: 29.9,
      categoryId: burgers.id,
      isFeatured: true,
    },
    {
      title: 'Bella Napoli',
      desc: 'A classic Italian delight featuring a thin, crispy crust, tangy tomato sauce, fresh mozzarella, and a medley of aromatic herbs topped with lettuce, tomatoes, and a dollop of tangy mayo.',
      img: '/temporary/p3.png',
      price: 24.9,
      categoryId: pizzas.id,
      isFeatured: true,
    },
    {
      title: 'Spicy Arrabbiata',
      desc: 'Ignite your taste buds with this fiery pasta creation, combining penne in a spicy tomato sauce infused with garlic, red chili flakes, and fresh basil for the ultimate comfort food experience.',
      img: '/temporary/p4.png',
      price: 26.9,
      categoryId: pastas.id,
      isFeatured: true,
    },
    {
      title: 'Jalapeño Fiesta',
      desc: 'Ignite your taste buds with a fiery kick! This burger features a succulent beef patty, fiery jalapeños, pepper jack cheese, and a zesty chipotle mayo sauce, and all the classic fixings on a toasted bun.',
      img: '/temporary/p5.png',
      price: 29.9,
      categoryId: burgers.id,
      isFeatured: true,
    },
    {
      title: 'Margherita Magic',
      desc: 'A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil, creamy mozzarella, and a drizzle of extra virgin olive oil, fresh arugula, and a drizzle of balsamic glaze.',
      img: '/temporary/p6.png',
      price: 24.9,
      categoryId: pizzas.id,
      isFeatured: true,
    },
    {
      title: 'Garlic Parmesan Linguine',
      desc: "A garlic lover's delight, featuring linguine smothered in a creamy Parmesan sauce, infused with garlic and garnished with chopped parsley, bell peppers, and cherry tomatoes.",
      img: '/temporary/p7.png',
      price: 28.9,
      categoryId: pastas.id,
      isFeatured: true,
    },
    {
      title: 'Mediterranean Delight',
      desc: 'Embark on a culinary journey with this Mediterranean-inspired creation, featuring zesty feta cheese, Kalamata olives, sun-dried tomatoes, and a sprinkle of oregano.',
      img: '/temporary/p8.png',
      price: 32.9,
      categoryId: pizzas.id,
      isFeatured: true,
    },
    {
      title: 'Hawaiian Teriyaki',
      desc: 'Experience a taste of the tropics with a juicy beef patty glazed in tangy teriyaki sauce, topped with grilled pineapple, crispy bacon, and fresh lettuce, and all the classic fixings on a toasted bun.',
      img: '/temporary/p9.png',
      price: 29.9,
      categoryId: burgers.id,
      isFeatured: true,
    },
    // NOT FEATURED
    {
      title: 'Pesto Primavera',
      desc: 'A classic Italian delight featuring a thin, crispy crust, tangy tomato sauce, fresh mozzarella, and a medley of aromatic herbs topped with lettuce, tomatoes, and a dollop of tangy mayo.',
      img: '/temporary/p10.png',
      price: 28.9,
      categoryId: pizzas.id,
    },
    {
      title: 'Veggie Supreme',
      desc: 'A classic Italian delight featuring a thin, crispy crust, tangy tomato sauce, fresh mozzarella, and a medley of aromatic herbs topped with lettuce, tomatoes, and a dollop of tangy mayo.',
      img: '/temporary/p11.png',
      price: 24.9,
      categoryId: pizzas.id,
    },
    {
      title: 'Four Cheese Fantasy',
      desc: 'Experience pure cheesy bliss with a melty blend of mozzarella, cheddar, provolone, and Parmesan cheeses, creating a rich and indulgent pizza experience.',
      img: '/temporary/p12.png',
      price: 22.9,
      categoryId: pizzas.id,
    },
    {
      title: 'Classic Cheeseburger',
      desc: 'A timeless favorite with a juicy beef patty, melted American cheese, crisp lettuce, ripe tomatoes, and our signature sauce on a toasted sesame bun.',
      img: '/temporary/p2.png',
      price: 18.9,
      categoryId: burgers.id,
    },
    {
      title: 'Tomato Basil Penne',
      desc: 'Perfectly cooked penne tossed in a rich tomato basil sauce, topped with grated Parmesan and fresh basil leaves.',
      img: '/temporary/p4.png',
      price: 19.9,
      categoryId: pastas.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: { ...product, options },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
