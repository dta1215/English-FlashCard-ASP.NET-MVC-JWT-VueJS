using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using vueWithJWT.DB;

namespace vueWithJWT.Repository
{
    public class GenericRespository<TEntity> where TEntity : class
    {
        //DbSet<T> DBSet { get; }
        internal FlashCardManagement context;
        internal DbSet<TEntity> dbset;

        public GenericRespository(FlashCardManagement _context)
        {
            this.context = _context;
            this.dbset = context.Set<TEntity>();
        }

        public virtual IEnumerable<TEntity> GetAll(string includeProperties = "")
        {
            IQueryable<TEntity> query = dbset;
            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }
            return query.ToList();
        }

        //public virtual IEnumerable<TEntity> GetAllPerPage(int page, int number_per_page = 12, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, string includeProperties = "")
        //{
        //    IQueryable<TEntity> query = dbset;
        //    foreach (var includeProperty in includeProperties.Split
        //        (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
        //    {
        //        query = query.Include(includeProperty);
        //    }
        //}

        //public virtual IEnumerable<TEntity> GetAllMatchID(object id, string includes = "")
        //{

        //}

        public virtual TEntity GetbyID(object id)
        {
            return dbset.Find(id);
        }

        public virtual void Add(TEntity model)
        {
            dbset.Add(model);
        }
        public virtual void Edit(object id, TEntity model)
        {
            dbset.Attach(model);
            context.Entry(model).State = EntityState.Modified;
        }
        public virtual void Delete(object id)
        {
            TEntity entityToDelete = dbset.Find(id);
            Delete(entityToDelete);
        }
        public virtual void Delete(TEntity entityToDelete)
        {
            if (context.Entry(entityToDelete).State == EntityState.Detached)
            {
                dbset.Attach(entityToDelete);
            }
            dbset.Remove(entityToDelete);
        }
    }
}