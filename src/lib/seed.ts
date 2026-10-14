import { db } from "@/db";
import { users, skillsOffered, skillsWanted, matches, exchanges, messages, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    return { message: "Database already seeded", count: existingUsers.length };
  }

  // Insert Users
  const insertedUsers = await db.insert(users).values([
    {
      name: "Sofía Martínez",
      email: "sofia@trueque.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
      bio: "Apasionada del maquillaje artístico y la belleza profesional. También manejo herramientas de Excel para startups. ¡Quiero aprender a reparar mi propia laptop y tocar guitarra!",
      city: "Buenos Aires",
      address: "Av. Libertador 1230, Buenos Aires",
      age: 24,
      rating: 4.9,
      totalReviews: 18,
      hoursBalance: 5,
      verified: true,
    },
    {
      name: "Carlos Gómez",
      email: "carlos@trueque.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      bio: "Técnico en sistemas especializado en mantenimiento de PC y armados gamer. Toco la guitarra desde hace 8 años. Busco apoyo para clases de automaquillaje para eventos y mejorar mi inglés.",
      city: "Buenos Aires",
      address: "Calle Corrientes 450, Buenos Aires",
      age: 28,
      rating: 5.0,
      totalReviews: 24,
      hoursBalance: 4,
      verified: true,
    },
    {
      name: "Mateo Rossi",
      email: "mateo@trueque.com",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
      bio: "Músico y fotógrafo profesional. Te enseñaré acordes, técnicas de canto y fotometría básica sin gastar un centavo.",
      city: "Buenos Aires",
      address: "Honduras 4800, Palermo, Buenos Aires",
      age: 26,
      rating: 4.8,
      totalReviews: 12,
      hoursBalance: 3,
      verified: true,
    },
    {
      name: "Elena Torres",
      email: "elena@trueque.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Traductora pública e instructora de inglés C2. Amo el intercambio de saberes libre de dinero. Me apasiona el yoga y la edición digital.",
      city: "Buenos Aires",
      address: "Juramento 2100, Belgrano, Buenos Aires",
      age: 31,
      rating: 5.0,
      totalReviews: 31,
      hoursBalance: 6,
      verified: true,
    },
    {
      name: "Lucía Benítez",
      email: "lucia@trueque.com",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
      bio: "Instructora certificada de Yoga Vinyasa y pastelera apasionada. Busco aprender bases de finanzas e inversión o programación.",
      city: "Buenos Aires",
      address: "Defensa 850, San Telmo, Buenos Aires",
      age: 23,
      rating: 4.9,
      totalReviews: 15,
      hoursBalance: 3,
      verified: true,
    },
    {
      name: "Andrés Ruiz",
      email: "andres@trueque.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "Desarrollador Fullstack Python/React y entusiasta del ciclismo urbano. Ofrezco tutorías de código y mantenimiento de bicis.",
      city: "Buenos Aires",
      address: "Juncal 1420, Recoleta, Buenos Aires",
      age: 29,
      rating: 4.7,
      totalReviews: 9,
      hoursBalance: 2,
      verified: true,
    },
  ]).returning();

  const [sofia, carlos, mateo, elena, lucia, andres] = insertedUsers;

  // Insert Skills Offered
  await db.insert(skillsOffered).values([
    {
      userId: sofia.id,
      title: "1 hora de Maquillaje Profesional",
      category: "beauty",
      description: "Aprende perfilado de rostros, maquillaje de noche o cuidado de la piel con técnicas profesionales paso a paso.",
      durationHours: 1,
      availability: "Lunes a Viernes, 6:00 p.m. - 8:00 p.m.",
      mode: "presencial",
      level: "Principiante a Avanzado",
    },
    {
      userId: sofia.id,
      title: "1 hora de Excel Básico e Intermedio",
      category: "tech",
      description: "Tablas dinámicas, fórmulas VLOOKUP/XLOOKUP y automatizaciones sencillas para organizar tus tareas o negocio.",
      durationHours: 1,
      availability: "Martes y Jueves, 4:00 p.m. - 6:00 p.m.",
      mode: "virtual",
      level: "Intermedio",
    },
    {
      userId: carlos.id,
      title: "1 hora de Reparación de PC y Hardware",
      category: "trades",
      description: "Diagnóstico de lentitud, optimización de Windows, limpieza interna de componentes o asesoría para armar tu PC Gamer.",
      durationHours: 1,
      availability: "Sábados y Domingos, 10:00 a.m. - 12:00 p.m.",
      mode: "presencial",
      level: "Todos los niveles",
    },
    {
      userId: carlos.id,
      title: "1 hora de Guitarra Acústica & Acordes",
      category: "music",
      description: "Clases prácticas desde cero: postura, rítmicas básicas, acordes mayores y menores para tocar tus canciones favoritas.",
      durationHours: 1,
      availability: "Martes 4:00 PM - 6:00 PM",
      mode: "ambos",
      level: "Principiante",
    },
    {
      userId: mateo.id,
      title: "1 hora de Técnica Vocal y Canto",
      category: "music",
      description: "Ejercicios de respiración diafragmática, colocación de voz, afinación y colocación escénica.",
      durationHours: 1,
      availability: "Miércoles y Viernes, 5:00 p.m. - 7:00 p.m.",
      mode: "ambos",
      level: "Principiante",
    },
    {
      userId: elena.id,
      title: "1 hora de Conversación en Inglés C2",
      category: "languages",
      description: "Conversación fluida sobre cultura, negocios, literatura o preparación para entrevistas laborales en inglés.",
      durationHours: 1,
      availability: "Lunes a Jueves, 7:00 p.m. - 9:00 p.m.",
      mode: "virtual",
      level: "Avanzado",
    },
    {
      userId: lucia.id,
      title: "1 hora de Hatha Yoga & Respiración",
      category: "fitness",
      description: "Sesión relajante de posturas físicas (asanas), estiramiento profundo y meditación guiada.",
      durationHours: 1,
      availability: "Sábados, 9:00 a.m. - 11:00 a.m.",
      mode: "ambos",
      level: "Todos los niveles",
    },
    {
      userId: andres.id,
      title: "1 hora de Programación Web (HTML, CSS, JS)",
      category: "tech",
      description: "Introducción al código, maquetación de tu primer sitio web o tutoría de JavaScript moderno.",
      durationHours: 1,
      availability: "Lunes y Miércoles, 6:00 p.m. - 8:00 p.m.",
      mode: "virtual",
      level: "Principiante",
    },
  ]);

  // Insert Skills Wanted
  await db.insert(skillsWanted).values([
    { userId: sofia.id, title: "Reparación de PC y Hardware", category: "trades" },
    { userId: sofia.id, title: "1 hora de Guitarra Acústica", category: "music" },
    { userId: carlos.id, title: "1 hora de Maquillaje Profesional", category: "beauty" },
    { userId: carlos.id, title: "Conversación en Inglés", category: "languages" },
    { userId: mateo.id, title: "Programación Web en React", category: "tech" },
    { userId: elena.id, title: "Yoga & Meditación", category: "fitness" },
    { userId: lucia.id, title: "Finanzas Personales", category: "business" },
    { userId: andres.id, title: "Alemán Básico", category: "languages" },
  ]);

  // Create mutual matches
  await db.insert(matches).values([
    { fromUserId: sofia.id, toUserId: carlos.id, action: "like", isMatch: true },
    { fromUserId: carlos.id, toUserId: sofia.id, action: "like", isMatch: true },
    { fromUserId: sofia.id, toUserId: elena.id, action: "like", isMatch: true },
    { fromUserId: elena.id, toUserId: sofia.id, action: "like", isMatch: true },
  ]);

  // Insert initial exchange proposal
  const [createdExchange] = await db.insert(exchanges).values({
    user1Id: sofia.id,
    user2Id: carlos.id,
    user1SkillTitle: "1 hora de Maquillaje Profesional",
    user2SkillTitle: "1 hora de Reparación de PC y Hardware",
    user1Availability: "Lunes a Viernes, 6:00 p.m. - 8:00 p.m.",
    user2Availability: "Sábados y Domingos, 10:00 a.m. - 12:00 p.m.",
    status: "confirmed",
    mode: "presencial",
    locationOrLink: "Av. Libertador 1230, Buenos Aires",
    scheduledDate: "Este Sábado, 10:30 AM",
    notes: "Sofía llevará sus insumos de maquillaje y Carlos sus herramientas de destornillador y pasta térmica.",
  }).returning();

  // Insert Messages
  await db.insert(messages).values([
    {
      exchangeId: createdExchange.id,
      senderId: carlos.id,
      receiverId: sofia.id,
      text: "¡Hola Sofía! Vi que quieres aprender a darle mantenimiento a tu PC y tú ofreces clases de maquillaje profesional. ¡Me vendría genial para un evento!",
    },
    {
      exchangeId: createdExchange.id,
      senderId: sofia.id,
      receiverId: carlos.id,
      text: "¡Hola Carlos! Sí, mi computadora está algo lenta. ¿Te parece bien este sábado a las 10:30 am en mi taller o en un café cercano?",
    },
    {
      exchangeId: createdExchange.id,
      senderId: carlos.id,
      receiverId: sofia.id,
      text: "¡Perfecto! Ya dejé confirmado el trueque en la app. Traeré los limpiadores y pasta térmica.",
    },
  ]);

  // Insert sample review
  await db.insert(reviews).values([
    {
      exchangeId: createdExchange.id,
      fromUserId: carlos.id,
      toUserId: sofia.id,
      rating: 5,
      comment: "Sofía es súper paciente y profesional explicando maquillaje. ¡Intercambio 100% recomendado!",
      skillTaught: "1 hora de Maquillaje Profesional",
    },
    {
      exchangeId: createdExchange.id,
      fromUserId: sofia.id,
      toUserId: carlos.id,
      rating: 5,
      comment: "Carlos dejó mi laptop impecable y volando. ¡Excelente profesional del trueque!",
      skillTaught: "1 hora de Reparación de PC",
    },
  ]);

  return { message: "Seed completed successfully", count: insertedUsers.length };
}
