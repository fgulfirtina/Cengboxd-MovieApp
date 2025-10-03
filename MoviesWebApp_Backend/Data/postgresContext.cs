using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace dbms.Models
{
    public partial class postgresContext : DbContext
    {
        public postgresContext()
        {
        }

        public postgresContext(DbContextOptions<postgresContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Actor> Actors { get; set; } = null!;
        public virtual DbSet<Director> Directors { get; set; } = null!;
        public virtual DbSet<Favorite> Favorites { get; set; } = null!;
        public virtual DbSet<Genre> Genres { get; set; } = null!;
        public virtual DbSet<Movie> Movies { get; set; } = null!;
        public virtual DbSet<Movietrailer> Movietrailers { get; set; } = null!;
        public virtual DbSet<Review> Reviews { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<Watchlist> Watchlists { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Name=DefaultConnection");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("pg_catalog", "adminpack");

            modelBuilder.Entity<Actor>(entity =>
            {
                entity.ToTable("actors");

                entity.Property(e => e.ActorId).HasColumnName("actor_id");

                entity.Property(e => e.ActorName)
                    .HasMaxLength(255)
                    .HasColumnName("actor_name");

                entity.Property(e => e.Awards).HasColumnName("awards");

                entity.Property(e => e.Biography).HasColumnName("biography");

                entity.Property(e => e.Birtdate).HasColumnName("birtdate");

                entity.Property(e => e.Nationality)
                    .HasMaxLength(20)
                    .HasColumnName("nationality");
            });

            modelBuilder.Entity<Director>(entity =>
            {
                entity.ToTable("directors");

                entity.Property(e => e.DirectorId).HasColumnName("director_id");

                entity.Property(e => e.Awards).HasColumnName("awards");

                entity.Property(e => e.Biography)
                    .HasMaxLength(255)
                    .HasColumnName("biography");

                entity.Property(e => e.Birtdate).HasColumnName("birtdate");

                entity.Property(e => e.DirectorName)
                    .HasMaxLength(255)
                    .HasColumnName("director_name");

                entity.Property(e => e.Nationality)
                    .HasMaxLength(20)
                    .HasColumnName("nationality");
            });

            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.MovieId })
                    .HasName("favorites_pkey");

                entity.ToTable("favorites");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.Property(e => e.MovieId).HasColumnName("movie_id");

                entity.Property(e => e.Adddate).HasColumnName("adddate");

                entity.HasOne(d => d.Movie)
                    .WithMany(p => p.Favorites)
                    .HasForeignKey(d => d.MovieId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("favorites_movie_id_fkey");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Favorites)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("favorites_user_id_fkey");
            });

            modelBuilder.Entity<Genre>(entity =>
            {
                entity.ToTable("genres");

                entity.Property(e => e.GenreId).HasColumnName("genre_id");

                entity.Property(e => e.GenreName)
                    .HasMaxLength(255)
                    .HasColumnName("genre_name");
            });

            modelBuilder.Entity<Movie>(entity =>
            {
                entity.ToTable("movies");

                entity.Property(e => e.MovieId).HasColumnName("movie_id");

                entity.Property(e => e.Description)
                    .HasMaxLength(255)
                    .HasColumnName("description");

                entity.Property(e => e.Duration).HasColumnName("duration");

                entity.Property(e => e.Imageurl)
                    .HasMaxLength(200)
                    .HasColumnName("imageurl");

                entity.Property(e => e.MovieName)
                    .HasMaxLength(255)
                    .HasColumnName("movie_name");

                entity.Property(e => e.MovieScore)
                    .HasPrecision(3, 1)
                    .HasColumnName("movie_score");

                entity.Property(e => e.ReleaseDate).HasColumnName("release_date");

                entity.Property(e => e.Trailerurl)
                    .HasMaxLength(255)
                    .HasColumnName("trailerurl");

                entity.HasMany(d => d.Actors)
                    .WithMany(p => p.Movies)
                    .UsingEntity<Dictionary<string, object>>(
                        "Movieactor",
                        l => l.HasOne<Actor>().WithMany().HasForeignKey("ActorId").HasConstraintName("movieactors_actor_id_fkey"),
                        r => r.HasOne<Movie>().WithMany().HasForeignKey("MovieId").HasConstraintName("movieactors_movie_id_fkey"),
                        j =>
                        {
                            j.HasKey("MovieId", "ActorId").HasName("movieactors_pkey");

                            j.ToTable("movieactors");

                            j.IndexerProperty<int>("MovieId").HasColumnName("movie_id");

                            j.IndexerProperty<int>("ActorId").HasColumnName("actor_id");
                        });

                entity.HasMany(d => d.Directors)
                    .WithMany(p => p.Movies)
                    .UsingEntity<Dictionary<string, object>>(
                        "Moviedirector",
                        l => l.HasOne<Director>().WithMany().HasForeignKey("DirectorId").HasConstraintName("moviedirectors_director_id_fkey"),
                        r => r.HasOne<Movie>().WithMany().HasForeignKey("MovieId").HasConstraintName("moviedirectors_movie_id_fkey"),
                        j =>
                        {
                            j.HasKey("MovieId", "DirectorId").HasName("moviedirectors_pkey");

                            j.ToTable("moviedirectors");

                            j.IndexerProperty<int>("MovieId").HasColumnName("movie_id");

                            j.IndexerProperty<int>("DirectorId").HasColumnName("director_id");
                        });

                entity.HasMany(d => d.Genres)
                    .WithMany(p => p.Movies)
                    .UsingEntity<Dictionary<string, object>>(
                        "Moviegenre",
                        l => l.HasOne<Genre>().WithMany().HasForeignKey("GenreId").HasConstraintName("moviegenres_genre_id_fkey"),
                        r => r.HasOne<Movie>().WithMany().HasForeignKey("MovieId").HasConstraintName("moviegenres_movie_id_fkey"),
                        j =>
                        {
                            j.HasKey("MovieId", "GenreId").HasName("moviegenres_pkey");

                            j.ToTable("moviegenres");

                            j.IndexerProperty<int>("MovieId").HasColumnName("movie_id");

                            j.IndexerProperty<int>("GenreId").HasColumnName("genre_id");
                        });
            });

            modelBuilder.Entity<Movietrailer>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("movietrailers");

                entity.Property(e => e.MovieId).HasColumnName("movie_id");

                entity.Property(e => e.Trailerurl)
                    .HasMaxLength(255)
                    .HasColumnName("trailerurl");
            });

            modelBuilder.Entity<Review>(entity =>
            {
                entity.ToTable("reviews");

                entity.Property(e => e.ReviewId).HasColumnName("review_id");

                entity.Property(e => e.MovieId).HasColumnName("movie_id");

                entity.Property(e => e.Rating).HasColumnName("rating");

                entity.Property(e => e.ReviewDate).HasColumnName("review_date");

                entity.Property(e => e.Reviewtext)
                    .HasMaxLength(500)
                    .HasColumnName("reviewtext");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.Movie)
                    .WithMany(p => p.Reviews)
                    .HasForeignKey(d => d.MovieId)
                    .HasConstraintName("reviews_movie_id_fkey");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Reviews)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("reviews_user_id_fkey");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.Property(e => e.Age).HasColumnName("age");

                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .HasColumnName("email");

                entity.Property(e => e.Gender)
                    .HasMaxLength(10)
                    .HasColumnName("gender");

                entity.Property(e => e.JoinDate).HasColumnName("join_date");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .HasColumnName("name");

                entity.Property(e => e.Password)
                    .HasMaxLength(256)
                    .HasColumnName("password");

                entity.Property(e => e.Profilepic)
                    .HasMaxLength(255)
                    .HasColumnName("profilepic");

                entity.Property(e => e.Username)
                    .HasMaxLength(20)
                    .HasColumnName("username");

                entity.Property(e => e.Usertype)
                    .HasMaxLength(5)
                    .HasColumnName("usertype");
            });

            modelBuilder.Entity<Watchlist>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.MovieId })
                    .HasName("watchlist_pkey");

                entity.ToTable("watchlist");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.Property(e => e.MovieId).HasColumnName("movie_id");

                entity.Property(e => e.Adddate).HasColumnName("adddate");

                entity.HasOne(d => d.Movie)
                    .WithMany(p => p.Watchlists)
                    .HasForeignKey(d => d.MovieId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("watchlist_movie_id_fkey");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Watchlists)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("watchlist_user_id_fkey");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
