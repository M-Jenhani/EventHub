package com.eventhub.config;

import com.eventhub.model.Event;
import com.eventhub.model.RSVP;
import com.eventhub.model.User;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.RSVPRepository;
import com.eventhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RSVPRepository rsvpRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        initializeUsers();
        initializeEvents();
        initializeAttendees();
    }
    
    private void initializeUsers() {
        // Create default admin user if it doesn't exist
        if (userRepository.findByEmail("admin@eventhub.tn").isEmpty()) {
            User admin = User.builder()
                    .email("admin@eventhub.tn")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Administrateur")
                    .lastName("EventHub")
                    .role(User.Role.ADMIN)
                    .enabled(true)
                    .build();
            
            userRepository.save(admin);
            log.info("Default admin user created: admin@eventhub.tn / admin123");
        }
        
        // Create Tunisian sample users
        List<User> sampleUsers = new ArrayList<>();
        
        if (userRepository.findByEmail("ahmed.ben.salem@gmail.com").isEmpty()) {
            sampleUsers.add(User.builder()
                    .email("ahmed.ben.salem@gmail.com")
                    .password(passwordEncoder.encode("password123"))
                    .firstName("Ahmed")
                    .lastName("Ben Salem")
                    .role(User.Role.USER)
                    .enabled(true)
                    .build());
        }
        
        if (userRepository.findByEmail("fatma.trabelsi@gmail.com").isEmpty()) {
            sampleUsers.add(User.builder()
                    .email("fatma.trabelsi@gmail.com")
                    .password(passwordEncoder.encode("password123"))
                    .firstName("Fatma")
                    .lastName("Trabelsi")
                    .role(User.Role.USER)
                    .enabled(true)
                    .build());
        }
        
        if (userRepository.findByEmail("mohamed.hamdi@gmail.com").isEmpty()) {
            sampleUsers.add(User.builder()
                    .email("mohamed.hamdi@gmail.com")
                    .password(passwordEncoder.encode("password123"))
                    .firstName("Mohamed")
                    .lastName("Hamdi")
                    .role(User.Role.USER)
                    .enabled(true)
                    .build());
        }
        
        if (userRepository.findByEmail("leila.gharbi@gmail.com").isEmpty()) {
            sampleUsers.add(User.builder()
                    .email("leila.gharbi@gmail.com")
                    .password(passwordEncoder.encode("password123"))
                    .firstName("Leila")
                    .lastName("Gharbi")
                    .role(User.Role.USER)
                    .enabled(true)
                    .build());
        }
        
        if (userRepository.findByEmail("karim.bouazizi@gmail.com").isEmpty()) {
            sampleUsers.add(User.builder()
                    .email("karim.bouazizi@gmail.com")
                    .password(passwordEncoder.encode("password123"))
                    .firstName("Karim")
                    .lastName("Bouazizi")
                    .role(User.Role.USER)
                    .enabled(true)
                    .build());
        }
        if (userRepository.findByEmail("asma.gharbi@gmail.com").isEmpty()) {
            sampleUsers.add(User.builder()
                    .email("asma.gharbi@gmail.com")
                    .password(passwordEncoder.encode("password123"))
                    .firstName("Asma")
                    .lastName("Gharbi")
                    .role(User.Role.USER)
                    .enabled(true)
                    .build());
        }
        
        if (!sampleUsers.isEmpty()) {
            userRepository.saveAll(sampleUsers);
            log.info("Created {} sample Tunisian users", sampleUsers.size());
        }
    }
    
    private void initializeEvents() {
        if (eventRepository.count() > 0) {
            log.info("Events already exist, skipping initialization");
            return;
        }
        
        User organizer = userRepository.findByEmail("ahmed.ben.salem@gmail.com")
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
        
        if (organizer == null) {
            log.warn("No organizer found, skipping event initialization");
            return;
        }

        User organizer2 = userRepository.findByEmail("fatma.trabelsi@gmail.com")
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
        
        if (organizer2 == null) {
            log.warn("No organizer found, skipping event initialization");
            return;
        }
        
        List<Event> events = new ArrayList<>();
        
        // Tech Conference in Tunis
        events.add(Event.builder()
                .title("Tunisia Tech Summit 2025")
                .description("Le plus grand événement technologique de Tunisie réunissant des experts en IA, blockchain et cybersécurité. Rejoignez-nous pour trois jours d'innovation, de networking et de découvertes technologiques.")
                .category(Event.Category.CONFERENCE)
                .eventDate(LocalDateTime.now().plusDays(15).withHour(9).withMinute(0))
                .location("Centre International de Conférences, Tunis")
                .capacity(500)
                .posterUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .organizer(organizer)
                .build());
        
        // Startup Workshop in Sousse
        events.add(Event.builder()
                .title("Atelier Entrepreneuriat Startup")
                .description("Un atelier pratique pour les entrepreneurs tunisiens sur la création et le développement de startups. Apprenez les meilleures pratiques, le financement et le pitch deck avec des mentors expérimentés.")
                .category(Event.Category.WORKSHOP)
                .eventDate(LocalDateTime.now().plusDays(7).withHour(14).withMinute(0))
                .location("Technopole de Sousse")
                .capacity(4)
                .posterUrl("https://plus.unsplash.com/premium_photo-1736892868469-865275d3b9e8?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .organizer(organizer2)
                .build());
        
        // Networking Event in Sfax
        events.add(Event.builder()
                .title("Sfax Business Networking Night")
                .description("Soirée de networking pour les professionnels et entrepreneurs de Sfax. Une opportunité unique de créer des connexions, d'échanger des idées et de développer votre réseau professionnel.")
                .category(Event.Category.NETWORKING)
                .eventDate(LocalDateTime.now().plusDays(10).withHour(18).withMinute(30))
                .location("Hôtel Mercure Sfax Centre")
                .capacity(150)
                .posterUrl("https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .organizer(organizer)
                .build());
        
        // Cultural Meetup in Carthage
        events.add(Event.builder()
                .title("Rencontre Culturelle à Carthage")
                .description("Découvrez l'histoire fascinante de Carthage avec des archéologues et historiens tunisiens. Visite guidée suivie d'une discussion sur la préservation du patrimoine culturel.")
                .category(Event.Category.MEETUP)
                .eventDate(LocalDateTime.now().plusDays(5).withHour(10).withMinute(0))
                .location("Site Archéologique de Carthage")
                .capacity(60)
                .posterUrl("https://images.unsplash.com/photo-1739049333672-b02ae6ad1c55?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .organizer(organizer2)
                .build());
        
        // Digital Marketing Seminar in Monastir
        events.add(Event.builder()
                .title("Séminaire Marketing Digital 2025")
                .description("Maîtrisez les dernières stratégies de marketing digital adaptées au marché tunisien. SEO, réseaux sociaux, e-commerce et analytics au programme.")
                .category(Event.Category.SEMINAR)
                .eventDate(LocalDateTime.now().plusDays(20).withHour(9).withMinute(30))
                .location("Centre de Formation, Monastir")
                .capacity(100)
                .posterUrl("https://images.unsplash.com/photo-1762968274962-20c12e6e8ecd?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .organizer(organizer)
                .build());
        
        // Sports Tournament in Hammamet
        events.add(Event.builder()
                .title("Tournoi de Football Hammamet Cup")
                .description("Tournoi de football amateur ouvert à toutes les équipes tunisiennes. Inscrivez votre équipe pour participer à cette compétition sportive conviviale.")
                .category(Event.Category.SPORTS)
                .eventDate(LocalDateTime.now().plusDays(12).withHour(8).withMinute(0))
                .location("Stade Municipal de Hammamet")
                .capacity(200)
                .organizer(organizer)
                .build());
        
        // Music Festival in La Marsa
        events.add(Event.builder()
                .title("Festival de Musique La Marsa")
                .description("Festival de musique en plein air célébrant la diversité musicale tunisienne. Artistes locaux et internationaux, ambiance festive garantie!")
                .category(Event.Category.SOCIAL)
                .eventDate(LocalDateTime.now().plusDays(25).withHour(19).withMinute(0))
                .location("Plage de La Marsa")
                .capacity(300)
                .posterUrl("https://plus.unsplash.com/premium_photo-1681830630610-9f26c9729b75?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .organizer(organizer2)
                .build());
        
        
        eventRepository.saveAll(events);
        log.info("Created {} sample Tunisian events", events.size());
    }
    
    private void initializeAttendees() {
        // Only add attendees if there are no RSVPs yet
        if (rsvpRepository.count() > 0) {
            log.info("Attendees already exist, skipping initialization");
            return;
        }
        
        List<Event> events = eventRepository.findAll();
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.USER)
                .toList();
        
        if (events.isEmpty() || users.isEmpty()) {
            log.warn("No events or users found for attendee initialization");
            return;
        }
        
        List<RSVP> rsvps = new ArrayList<>();
        
        // Add attendees to each event
        for (Event event : events) {
            int attendeeCount = 0;
            
            // Add different attendees to each event
            for (User user : users) {
                // Skip if user is the organizer
                if (user.getId().equals(event.getOrganizer().getId())) {
                    continue;
                }
                
                // Check if event capacity is still available
                if (attendeeCount < event.getCapacity()) {
                    RSVP rsvp = RSVP.builder()
                            .user(user)
                            .event(event)
                            .status(RSVP.RSVPStatus.CONFIRMED)
                            .build();
                    rsvps.add(rsvp);
                    attendeeCount++;
                } else {
                    // Add to waitlist if capacity is reached
                    RSVP rsvp = RSVP.builder()
                            .user(user)
                            .event(event)
                            .status(RSVP.RSVPStatus.WAITLIST)
                            .build();
                    rsvps.add(rsvp);
                }
            }
        }
        
        if (!rsvps.isEmpty()) {
            rsvpRepository.saveAll(rsvps);
            log.info("Created {} attendee registrations", rsvps.size());
        }
    }
}
